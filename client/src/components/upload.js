import React, { useState } from "react";
import "./upload.css";
import Axios from "axios";

function App() {
  const [file, setFile] = useState();

  const send = event => {
    const data = new FormData();
    data.append("file", file);

    Axios.post("http://localhost:3001/upload", data)
      .then(res => console.log(res))
      .catch(err => console.log(err));
      console.log(data)
  };

  return (
    <div className="App">
      <header className="App-header">
        <form encType="multipart/form-data" action="/upload" method="post">
          <div className="flex">
          </div>
          <div className="flex">
            <input
              type="file"
              id="file"
              accept=".jpg, .png"
              onChange={event => {
                const file = event.target.files[0];
                setFile(file);
              }}
            />
          </div>
        </form>
        <button onClick={send}>Send</button>
      </header>
    </div>
  );
}

export default App;