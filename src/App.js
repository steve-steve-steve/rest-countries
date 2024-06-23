import './App.css';
import axios from 'axios';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {AgGridReact} from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid


function App() {
  const gridRef = useRef();

  const [countries, setCountries] = useState([])
  const [colDefs] = useState([
    {field: "name", flex: 1, filter: true, sort: "asc"},
    {field: "flag", flex: 0.5},
    {field: "population", flex: 1},
    {field: "languages", flex: 3, filter: true},
    {field: "currencies", flex: 2, filter: true},
  ]);

  useEffect(() => {

    const fetchCountries = async () => {
      try {
        const {data} = await axios.get('https://restcountries.com/v3.1/all')
        let countries = data.map(e => ({
          name: e.name.common,
          flag: e.flag,
          population: new Intl.NumberFormat().format(Number(e.population)),
          languages: e.languages ? Object.values(e.languages).join(", ") : "N/A",
          currencies: e.currencies ? buildCurrencylist(Object.values(e.currencies)) : "N/A",
        }))
        setCountries(countries);
      } catch (error) {
        console.error("Error getting countries:", error);
      }
    }
    fetchCountries()
  }, [countries]);

  const buildCurrencylist = (currencies) => currencies.map(c => c.name).join(", ")

  return (
    <div>
      <div
        className="ag-theme-quartz"
        style={{height: 500}}
      >
        <AgGridReact
          ref={gridRef}
          rowData={countries}
          columnDefs={colDefs}
          rowSelection={"single"}
        />
      </div>
    </div>
  );
}

export default App;
