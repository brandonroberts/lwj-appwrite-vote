import { useState, useEffect } from 'react';
import './Vote.css';

export default function LoginForm({ user }) {
  const [selected, setSelected] = useState('');
  const [items, setItems] = useState([]);
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState({});

  async function vote(e) {
    e.preventDefault();

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
                />
              </div>
              <div className="vote-count">{votes[item['$id']] || 0}</div>
            </div>
          );
        })}
      </div>

      <form className="vote-form" onSubmit={vote}>
        <button disabled={!selected || voted} type="submit">Vote</button>
      </form>
    </div>
  );
}
