import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

console.log("API_URL:", API_URL);

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchMessages = () => {
    axios
      .get(`${API_URL}/api/hello`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else if (Array.isArray(res.data.data)) {
          setMessages(res.data.data);
        } else {
          setMessages([]);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = () => {
    if (!input) return;

    if (editingId) {
      axios
        .put(`${API_URL}/api/hello/${editingId}`, { text: input })
        .then(() => {
          setInput("");
          setEditingId(null);
          fetchMessages();
        });
    } else {
      axios.post(`${API_URL}/api/hello`, { text: input }).then(() => {
        setInput("");
        fetchMessages();
      });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/api/hello/${id}`).then(() => fetchMessages());
  };

  const handleEdit = (msg) => {
    setInput(msg.text);
    setEditingId(msg.id);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💬 Message Board</h1>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button style={styles.button} onClick={handleSubmit}>
          {editingId ? "Update" : "Send"}
        </button>
      </div>
      <ul style={styles.list}>
        {messages.map((msg) => (
          <li key={msg.id} style={styles.listItem}>
            <span>{msg.text}</span>
            <div>
              <button style={styles.editBtn} onClick={() => handleEdit(msg)}>
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(msg.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f7f9fc",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    marginBottom: "20px",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  editBtn: {
    marginRight: "5px",
    padding: "5px 10px",
    borderRadius: "3px",
    border: "none",
    backgroundColor: "#ffc107",
    color: "#fff",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "5px 10px",
    borderRadius: "3px",
    border: "none",
    backgroundColor: "#f44336",
    color: "#fff",
    cursor: "pointer",
  },
};

export default App;
