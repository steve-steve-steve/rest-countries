import './App.css';
import axios from 'axios';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {AgGridReact} from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid


function App() {
  const gridRef = useRef();

  const FavouriteButtonComponent = (props) => {
    let buttonText = props.data.favourite ? "Remove" : "Add"
    return <button onClick={() => {
      setSelectedRow(props.data)
      setCountries(prevCountries =>
        prevCountries.map(country => country.name === props.data.name ? {
            ...country,
              favourite: !props.data.favourite
          } : country
        ))
    } }>{buttonText}</button>;
  };

  const [countries, setCountries] = useState(() => {
    const savedCountries = localStorage.getItem('countries');
    return savedCountries ? JSON.parse(savedCountries) : [];
  });

  const [selectedRow, setSelectedRow] = useState({});
  const [colDefs] = useState([
    {field: "name", flex: 1, filter: true, sort: "asc"},
    {field: "flag", flex: 0.5},
    {field: "population", flex: 1},
    {field: "languages", flex: 3, filter: true},
    {field: "currencies", flex: 2, filter: true},
    {field: "favourite", flex: 1, cellRenderer: FavouriteButtonComponent, filter: true }
  ]);

  useEffect(() => {
    if (countries.length > 0) {
      if (!selectedRow.name) setSelectedRow(countries[129])
      return
    }
    const fetchCountries = async () => {
      try {
        const {data} = await axios.get('https://restcountries.com/v3.1/all')
        let countries = data.map(e => ({
          name: e.name.common,
          flag: e.flag,
          population: new Intl.NumberFormat().format(Number(e.population)),
          languages: e.languages ? Object.values(e.languages).join(", ") : "N/A",
          currencies: e.currencies ? buildCurrencylist(Object.values(e.currencies)) : "N/A",
          continents: e.continents.join(', '),
          unMember: e.unMember ? "Yes" : "No",
          region: e.region,
          capital: e.capital,
          landlocked: e.landlocked ? "Yes" : "No",
          coatOfArms: e.coatOfArms.svg,
          subRegion: e.subregion,
          startOfWeek: e.startOfWeek,
          rightHandDrive: e.car.side === "right" ? "Yes" : "No",
          favourite: false
        }))
        setCountries(countries);
        setSelectedRow(countries[129])
      } catch (error) {
        console.error("Error getting countries:", error);
      }
    }
    fetchCountries()
  }, [countries]);

  useEffect(() => {
    localStorage.setItem('countries', JSON.stringify(countries));
  }, [countries]);

  const buildCurrencylist = (currencies) => currencies.map(c => c.name).join(", ")

  const onSelectionChanged = useCallback(() => {
    const row = gridRef.current.api.getSelectedRows();
    if (row[0]) setSelectedRow(row[0])
  }, [setSelectedRow]);

  return (
    <div>
      <div className="Country-details-header">{selectedRow.name}</div>
      <div className="Country-details-container">
        <div className="Country-details-section">
          <div>Capital: {selectedRow.capital}</div>
          <div>Region: {selectedRow.region}</div>
          <div>Sub-region: {selectedRow.subRegion}</div>
        </div>
        <div className="Country-details-section">
          <div>Continent(s): {selectedRow.continents}</div>
          <div>Landlocked: {selectedRow.landlocked}</div>
          <div>UN Member: {selectedRow.unMember}</div>
        </div>
        <div className="Country-details-section">
          <div>Capital: {selectedRow.capital}</div>
          <div>Right Hand Drive: {selectedRow.rightHandDrive}</div>
          <div>Coat of Arms:
            <img className="Country-details-coat-of-arms" src={selectedRow.coatOfArms}
                 alt="Coat of Arms" width="20" height="20"/>
          </div>
        </div>
      </div>

      <div
        className="ag-theme-quartz"
        style={{height: 500}}
      >
        <AgGridReact
          ref={gridRef}
          rowData={countries}
          columnDefs={colDefs}
          rowSelection={"single"}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </div>
  );
}

export default App;
