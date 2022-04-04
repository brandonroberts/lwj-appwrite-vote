import { Query } from 'appwrite';
import { useEffect, useState } from 'react';
import { api } from '../api';
import './Vote.css';

export default function LoginForm() {
  const [user, setUser] = useState('');
  const [selected, setSelected] = useState('');
  const [items, setItems] = useState([]);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    api.account.get().then((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (user) {
      api.database.listDocuments('votes', [
        Query.equal('userId', user.$id)
      ]).then((data) => {
        if (data.documents.length > 0) {
          setVoted(true);
          setSelected(data.documents[0]['itemId']);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    api.database
      .listDocuments('items')
      .then((data) => setItems(data.documents));
  }, []);

  function select(itemId) {
    if (!voted) {
      setSelected(itemId);
    }
  }

  async function vote(e) {
    e.preventDefault();

    try {
      await api.database.createDocument('votes', 'unique()', {
        itemId: selected,
        userId: user.$id,
      });
  
      setVoted(true);
    } catch(e) {
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
                  src={item.imgUrl}
                  onClick={() => select(item['$id'])}
                />
              </div>
              <div className="vote-count">{0}</div>
            </div>
          );
        })}
      </div>

      <form className="vote-form" onSubmit={vote}>
        <button disabled={!selected || voted} className={!selected || voted ? ' disabled' : ''}type="submit">Vote</button>
      </form>
    </div>
  );
}
