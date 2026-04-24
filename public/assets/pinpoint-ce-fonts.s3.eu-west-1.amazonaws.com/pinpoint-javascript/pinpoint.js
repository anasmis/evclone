// Create a namespace for the library to avoid global conflicts
var pinpoint = pinpoint || {};

///////////////////////////////////////////////////////////////////////////////////

// A function which creates a custom element, adds relevant attributes, and appends to parent element
pinpoint.createCustomElement = function (tag, parentJSPath, attributes, positionOrSelector) {
  var element = document.createElement(tag);
  var parent = document.querySelector(parentJSPath);

  // Check if the attributes parameter is an object
  if (attributes && typeof attributes === 'object') {
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        element.setAttribute(key, attributes[key]);
      }
    }
  }

  // Check if the parent is a valid DOM element
  if (parent instanceof Element) {
    try {
      if (positionOrSelector === 'firstChild') {
        parent.insertBefore(element, parent.firstChild);
      } else if (positionOrSelector) {
        var sibling = parent.querySelector(positionOrSelector);
        if (sibling) {
          parent.insertBefore(element, sibling);
        } else {
          console.error('Sibling not found with the provided selector:', positionOrSelector);
          parent.appendChild(element); // Fallback to append if the selector is not valid
        }
      } else {
        parent.appendChild(element);
      }
    } catch (error) {
      console.error('Error inserting element:', error);
    }
  } else {
    console.error('Invalid element provided:', parentJSPath);
  }

  return element;
};

///////////////////////////////////////////////////////////////////////////////////

// A function to update links with a specified href value
pinpoint.updateLinks = function (hrefValue, attributeName, attributeValue) {
  // Check if hrefValue is a string
  if (typeof hrefValue !== 'string') {
    console.error('Invalid hrefValue provided.');
    return;
  }

  // Check if attributeName is a string
  if (typeof attributeName !== 'string') {
    console.error('Invalid attributeName provided.');
    return;
  }

  // Get all links
  var links = document.links;

  // Check if attributeValue is provided and is a string
  if (attributeValue && typeof attributeValue !== 'string') {
    console.error('Invalid attributeValue provided.');
    return;
  }

  // Update either the specified attribute's value or the textContent of the links
  if (links) {
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.endsWith(hrefValue)) {
        if (attributeValue) {
          // Update the specified attribute's value
          links[i].setAttribute(attributeName, attributeValue);
        } else {
          // Update the textContent of the link
          links[i].textContent = attributeName;
        }
      }
    }
  }
};

///////////////////////////////////////////////////////////////////////////////////

// A function to update the textContent of an element based on its JS path
pinpoint.updateText = function (elementPath, newText) {
  // Check if elementPath is a string
  if (typeof elementPath !== 'string') {
    console.error('Invalid elementPath provided.');
    return;
  }

  // Check if newText is a string
  if (typeof newText !== 'string') {
    console.error('Invalid newText provided.');
    return;
  }

  // Find the element based on the JS path
  var element = document.querySelector(elementPath);

  // Check if the element exists
  if (element) {
    // Update the textContent
    element.textContent = newText;
  }
};
