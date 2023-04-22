import { useEffect, useState } from "react";
import { saveAs } from "file-saver";

import "./App.css";
import * as XLSX from "xlsx";
function App() {
  const [data, setData] = useState([{}]);
  const [keys, setKeys] = useState([]);

  let promise;
  const readExcel = (file) => {
    promise = new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (event) => {
        const bufferArray = event.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        res(data);
      };

      fileReader.onerror = (error) => {
        rej(error);
      };
    });
  };

  const getData = () => {
    promise.then((res) => {
      setData(res);
    });
  };

  const handleDownload = () => {
    const templateURL = `${window.location.origin}/../public/my-excel.xlsx`;
    fetch(templateURL)
      .then((response) => response.blob())
      .then((blob) => saveAs(blob, "demo_File.xlsx"))
      .catch((error) => console.error("Error downloading template", error));
  };

  useEffect(() => {
    let arr = data[0];
    let keys = Object.keys(arr);
    setKeys(keys);
  }, [data]);

  return (
    <div>
      <div>
        <nav
          class="navbar navbar-expand-sm"
          style={{ background: "#FFBF00", fontWeight: "bold" }}
        >
          <div class="container-fluid">
            <div
              class="collapse navbar-collapse"
              id="navbarSupportedContent"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <h4>Fetch Data From Excel</h4>
            </div>
          </div>
          <div>
            <button
              className="btn btn-info mx-2 dbutton"
              onClick={handleDownload}
            >
              Download_Template
            </button>
          </div>
        </nav>
      </div>

      <div
        className=" mt-4"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          className="file-input"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <input
            type="file"
            accept=".xlsx"
            className="btn btn-dark"
            onChange={(event) => {
              const files = event.target.files[0];
              readExcel(files);
            }}
          />
        </div>
        <div
          className="mt-2"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {" "}
          <button className="btn btn-success mx-2" onClick={getData}>
            Submit
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <br />
        </div>
      </div>

      <div>
        <table class="table table-bordered ">
          <thead>
            <tr style={{backgroundColor:"#FFAC1C ",color:"black",textAlign:"center"}}>
              {keys.map((ele) => {
                return <th scope="col">{ele}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((ele, i) => {
              return (
                <tr>
                  {" "}
                  {keys.map((ky, i) => {
                    return <td>{ele[ky]}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
