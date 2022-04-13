import { Query } from 'appwrite';
import { useEffect, useState } from 'react';
import { api } from '../api';
import './Vote.css';

export default function LoginForm({ user }) {
  const [selected, setSelected] = useState('');
  const [items, setItems] = useState([]);
  const [votes, setVotes] = useState({});

  useEffect(async() => {
    const data = await api.database.listDocuments('item');
    const reqs = data.documents.map(doc => api.database.listDocuments('votes', [
      Query.equal('itemId', doc.$id)
    ]))
    const counts = await Promise.all(reqs);
    const totals = {};
    counts.forEach(count => {
      if (count.total > 0) {
        totals[count.documents[0].itemId] = count.total;
      }
    });
    
    setVotes(totals);    
    setItems(data.documents);
  }, []);

  useEffect(() => {
    const unsubscribe = api.subscribe(['collections.votes.documents'], data => {
      if (data.event === 'database.documents.create') {

        setVotes(currentVotes => {
          const newVotes = { ...currentVotes };

          if(newVotes[data.payload.itemId]) {
            newVotes[data.payload.itemId]++;
          } else {
            newVotes[data.payload.itemId] = 1;
          }
          return newVotes;
        });
      }
    })

    return () => {
      unsubscribe();
    }
  }, [])

  function select(itemId) {
    setSelected(itemId);
  }

  async function vote(e) {
    e.preventDefault();

    try {
      const {jwt} = await api.account.createJWT();
      await fetch('.netlify/functions/vote', {
        method: 'POST',
        headers: {
          jwt
        },
        body: JSON.stringify({
          itemId: selected,
          userId: user.$id,
        })
      });
    } catch(e) {
      console.log(`Error: ${e}`);
    }
  }

  return (
    <div className="vote-container">
      <span className="name">Hello {user ? user.name : ''}</span>
      <span className="instructions">
        Please select the item you'd like to vote for
      </span>

      <div className="vote-item-container">
        {items.map((item) => {
          return (
            <div key={item['$id']}>
              <div
                className={
                  'vote-item' + (item['$id'] === selected ? ' selected' : '')
                }
                key={item.id}
              >
                <img
                  src={item.imageUrl}
                  onClick={() => select(item['$id'])}
                />
              </div>
              <div className="vote-count">{votes[item['$id']] || 0}</div>
            </div>
          );
        })}
      </div>

      <form className="vote-form" onSubmit={vote}>
        <button disabled={!selected} type="submit">Vote</button>
      </form>
    </div>
  );
}
