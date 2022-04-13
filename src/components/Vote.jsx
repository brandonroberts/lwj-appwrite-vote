import { useEffect, useState } from 'react';
import { api } from '../api';
import './Vote.css';

export default function LoginForm({ user }) {
  const [selected, setSelected] = useState('');
  const [items, setItems] = useState([]);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    if (user) {
      api.database.listDocuments('votes', [], 100).then((data) => {
        const votedDoc = data.documents.find(doc => doc.userId === user.$id);

        if (votedDoc) {
          setSelected(votedDoc.itemId);
        }

        const items = {};
        data.documents.forEach(doc => {
          if(items[doc.itemId]) {
            items[doc.itemId]++;
          } else {
            items[doc.itemId] = 1;
          }
        });
        setVotes(items);
      });
    }
  }, [user]);

  useEffect(async() => {
    const data = await api.database.listDocuments('item');
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
