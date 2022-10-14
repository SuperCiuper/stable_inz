import React, { useEffect, useState } from "react";
import { AddApiaryModal, SortUpDownButton } from "../../components";
import { API_URL } from "../../constants";
import "./ApiaryView.css";

const ApiaryView = () => {
  const [apiaries, setApiaries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterDates, setFilterDates] = useState({ from: "", to: "" });
  const [filterByDate, setFilterByDate] = useState(false);
  const [sortedDown, setSortedDown] = useState(true);

  const visibilityToggle = () => {
    setModalVisible(!modalVisible);
  };

  const fetchApiaries = () => {
    fetch(API_URL)
      .then((response) =>
        response.ok ? response.json() : Promise.reject("Response not ok")
      )
      .then((response) => {
        setApiaries(response);
      });
  };
  useEffect(() => {
    fetchApiaries();
  }, []);

  return (
    <div className="ApiaryView">
      <h1>Apiary view</h1>
      <label>
        Sort by date:&nbsp;
        <input
          checked={filterByDate}
          type="checkbox"
          onChange={(event) => {
            setFilterByDate(event.target.checked);
            if (!event.target.checked) {
              setFilterDates({ from: "", to: "" });
            }
          }}
        />
        <input
          disabled={!filterByDate}
          value={filterDates.from}
          max={filterDates.to}
          type="date"
          placeholder="Start date"
          onChange={(event) => {
            setFilterDates({
              from: event.target.value,
              to: filterDates.to,
            });
          }}
        />
        <input
          disabled={!filterByDate}
          value={filterDates.to}
          min={filterDates.from}
          type="date"
          placeholder="End date"
          onChange={(event) => {
            setFilterDates({
              from: filterDates.from,
              to: event.target.value,
            });
          }}
        />
      </label>
      <button
        className="AddApiaryBtn"
        onClick={() => {
          visibilityToggle();
        }}
      >
        Add Apiary
      </button>
      <div className="ApiaryTableContainer">
        <table className="ApiaryTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>
                <SortUpDownButton
                  sortedDown={sortedDown}
                  setSortedDown={setSortedDown}
                >
                  Number
                </SortUpDownButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {apiaries
              .sort((a, b) =>
                sortedDown ? a.number - b.number : b.number - a.number
              )
              .filter((item) => {
                if (filterDates.from !== "") {
                  if (
                    item.date < filterDates.from.split("-").reverse().join(".")
                  )
                    return false;
                }
                if (filterDates.to !== "") {
                  if (filterDates.to.split("-").reverse().join(".") < item.date)
                    return false;
                }
                return true;
              })
              .map((item) => (
                <tr key={item.number}>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                  <td>{item.number}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <AddApiaryModal
        apiariesRefresh={fetchApiaries}
        visibilityToggle={visibilityToggle}
        visible={modalVisible}
      />
    </div>
  );
};

export default ApiaryView;
