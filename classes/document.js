class Document {
  constructor(selector) {
    this.elements = Array.from(document.querySelectorAll(selector));
  }

  static create(selector) {
    return new Document(selector);
  }

  text(value) {
    if (arguments.length === 0) {
      return this.elements[0].textContent;
    }
    this.elements.forEach((element) => {
      element.textContent = value;
    });
    return this;
  }

  html(value) {
    if (arguments.length === 0) {
      return this.elements[0].innerHTML;
    }
    this.elements.forEach((element) => {
      element.innerHTML = value;
    });
    return this;
  }

  append(content) {
    if (typeof content === "string") {
      this.elements.forEach((element) => {
        element.insertAdjacentHTML("beforeend", content);
      });
    } else if (content instanceof Document) {
      this.elements.forEach((element) => {
        content.elements.forEach((childElement) => {
          element.appendChild(childElement.cloneNode(true));
        });
      });
    } else if (content instanceof HTMLElement) {
      this.elements.forEach((element) => {
        element.appendChild(content.cloneNode(true));
      });
    }
    return this;
  }

  prepend(content) {
    if (typeof content === "string") {
      this.elements.forEach((element) => {
        element.insertAdjacentHTML("afterbegin", content);
      });
    } else if (content instanceof Document) {
      this.elements.forEach((element) => {
        content.elements.reverse().forEach((childElement) => {
          element.prepend(childElement.cloneNode(true));
        });
      });
    } else if (content instanceof HTMLElement) {
      this.elements.forEach((element) => {
        element.prepend(content.cloneNode(true));
      });
    }
    return this;
  }

  addClass(className) {
    if (className)
      this.elements.forEach((element) => {
        element.classList.add(className);
      });
    return this;
  }

  removeClass(className) {
    this.elements.forEach((element) => {
      element.classList.remove(className);
    });
    return this;
  }

  attr(attributeName, attributeValue) {
    if (arguments.length === 1) {
      return this.elements[0].getAttribute(attributeName);
    }
    this.elements.forEach((element) => {
      element.setAttribute(attributeName, attributeValue);
    });
    return this;
  }

  on(eventName, eventHandler) {
    this.elements.forEach((element) => {
      element.addEventListener(eventName, eventHandler);
    });
    return this;
  }

  off(eventName, eventHandler) {
    this.elements.forEach((element) => {
      element.removeEventListener(eventName, eventHandler);
    });
    return this;
  }

  css(styles) {
    this.elements.forEach((element) => {
      Object.assign(element.style, styles);
    });
    return this;
  }

  hide() {
    this.elements.forEach((element) => {
      element.style.display = "none";
    });
    return this;
  }

  show() {
    this.elements.forEach((element) => {
      element.style.display = "";
    });
    return this;
  }
}

window.Doc = Document.create;
/**  
@EXAMPLE

const $ = DocumentHelper.create;

$(".my-element")
  .addClass("highlight")
  .text("Hello, world!")
  .on("click", () => {
    console.log("Element clicked");
  });

$("#myButton").hide();



*/
