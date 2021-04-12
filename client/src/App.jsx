import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await (
        await fetch("/api/users", {
          method: "GET",
        })
      ).json();
      setUsers(res);
    };
    fetchData();
  }, []);

  return (
    <div>
      {users.map((user) => {
        return <li>{user.role}</li>;
      })}
    </div>
  );
}

export default App;
