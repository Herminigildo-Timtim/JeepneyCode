import React, { useState } from 'react';
import routesData from './routesData.json'; // Importing route data from a JSON file
import './RouteFinder.css'; // Importing CSS file for styling

const RouteFinder = () => {
  const [input, setInput] = useState(''); // State to store input
  const [output, setOutput] = useState(''); // State to store output

  const findRoutes = () => {
    const jeepCodes = input.split(',').map(code => code.trim()); // Splitting input into individual jeep codes
    const commonRoutes = findCommonRoutes(jeepCodes); // Finding common routes between jeep codes
    const colorMappings = generateColorMappings(jeepCodes); // Generating color mappings for highlighting routes

    let result = []; // Array to store formatted output

    jeepCodes.forEach((jeepCode, index) => {
      if (index > 0) result.push('\n'); // Add a new line for each Jeep code except the first one

      if (!isValidJeepCode(jeepCode)) { // Checking if jeep code is valid
        alert(`${jeepCode} doesn't exist`); // Alert if jeep code is invalid
      } else {
        const places = routesData[jeepCode]; // Getting places for the current jeep code
        result.push(
          <React.Fragment key={jeepCode}>
            <span className="jeepney-code">{jeepCode}</span> ➜ {places.map(place => highlightPlace(place, jeepCode, commonRoutes, colorMappings)).reduce((prev, curr) => [prev, ' ⟷ ', curr])}
            {/* Mapping and highlighting places for the current jeep code */}
          </React.Fragment>
        );
      }
    });

    setOutput(result); // Setting the output state with formatted result
  };

  const isValidJeepCode = (code) => {
    const regex = /^\d{2}[A-Z]$/; // Regex pattern for valid jeep code
    return regex.test(code) && routesData.hasOwnProperty(code); // Checking if code matches the pattern and exists in route data
  };

  const findCommonRoutes = (jeepCodes) => {
    const commonRoutes = {}; // Object to store common routes
    jeepCodes.forEach(code => {
      const places = routesData[code]; // Getting places for the current jeep code
      if (places) { // Checking if places data exists
        places.forEach(place => {
          commonRoutes[place] = commonRoutes[place] || []; // Initializing array for place if not exists
          commonRoutes[place].push(code); // Adding jeep code to common routes for the place
        });
      }
    });
    return commonRoutes; // Returning common routes object
  };

  const generateColorMappings = (jeepCodes) => {
    const colorMappings = {}; // Object to store color mappings
    let colorIndex = 0;

    jeepCodes.forEach((code1, index1) => {
      jeepCodes.forEach((code2, index2) => {
        if (index1 < index2) { // Checking if code1 comes before code2 to avoid duplicates
          const color = getColor(colorIndex++); // Getting color based on color index
          colorMappings[`${code1},${code2}`] = color; // Mapping color for pair of jeep codes
          colorMappings[`${code2},${code1}`] = color; // Ensuring both permutations have the same color
        }
      });
    });

    return colorMappings; // Returning color mappings object
  };

  const highlightPlace = (place, currentJeepCode, commonRoutes, colorMappings) => {
    const commonTo = commonRoutes[place] && commonRoutes[place].filter(code => code !== currentJeepCode); // Getting jeep codes common to the place
    if (commonTo && commonTo.length > 0) { // Checking if common routes exist for the place
      const color = colorMappings[`${currentJeepCode},${commonTo[0]}`]; // Getting color for highlighting
      return <span className="highlighted" style={{ color: color, fontWeight: 'bold',fontStyle: 'italic' }}>{place}</span>; // Changing font color with specified color
    }
    return place; // Returning unhighlighted place if no common routes
  };

  const getColor = (index) => {
    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow']; // Array of colors for highlighting
    return colors[index % colors.length]; // Returning color based on index
  };

  const handleInputChange = (event) => {
    setInput(event.target.value); // Handling input change
  };

  return (
    <div className="container"> 
      <input
        className="input-field"
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter Jeep Codes separated by comma"
      />
      <button className="find-button" onClick={findRoutes}>Find Routes</button>
      <div className="output">{output}</div> {/* Displaying output */}
    </div>
  );
};

export default RouteFinder;
