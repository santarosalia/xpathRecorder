let xPathContentDiv = this.top.document.createElement("div");
xPathContentDiv.id = "xPathContent";
if (this.top.document.getElementById("xPathContent") == null) {
  this.top.document.head.after(xPathContentDiv);
}

this.document.addEventListener("click", (e) => {
  let frameList = [];
  this.frameElement ? frameList.push(this.frameElement) : null;
  let parent = this.parent.frameElement ? this.parent : null;

  while (parent != null) {
    parent.frameElement ? frameList.push(parent.frameElement) : null;
    if (parent.parent.frameElement != null) {
      parent = parent.parent;
    } else {
      break;
    }
  }
  let frameXpathList = frameList.map((frame) => getXPath(frame));

  const xPath = getXPath(e.target);
  let frameP = this.top.document.createElement("p");

  frameXpathList.reverse().map((item, i) => {
    frameP.textContent += i + 1 + "번째 프레임 : " + item;
  });
  let xPathP = this.top.document.createElement("p");
  xPathP.textContent = xPath;
  this.top.document.getElementById("xPathContent").appendChild(frameP);
  this.top.document.getElementById("xPathContent").appendChild(xPathP);
  const result = chrome.runtime.sendMessage({
    type: "info",
    frame: frameXpathList,
    xPath: xPath,
  });
  result.then((r) => {
    console.log("ok");
  });
});

this.document.addEventListener("mouseover", (e) => {
  e.target.classList.add("highlight");
});

this.document.addEventListener("mouseout", (e) => {
  e.target.classList.remove("highlight");
});

const getXPath = (el) => {
  let nodeElem = el;
  let isFlexibleXpath = /^-?\d+$/.test(nodeElem.id.slice(-1)); // 마지막 두자리가 숫자일경우 가변될 xpath라고 판단하기 위한 변수

  if (nodeElem.id && !isFlexibleXpath) {
    return `//*[@id="${nodeElem.id}"]`; //선택된 엘리먼트의 id가 있을 경우 id 형식의 xpath를 바로 리턴
  }

  const parts = [];
  while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
    let nbOfPreviousSiblings = 0;
    let hasNextSiblings = false;
    let sibling = nodeElem.previousSibling;

    while (sibling) {
      if (
        sibling.nodeType !== Node.DOCUMENT_TYPE_NODE &&
        sibling.nodeName === nodeElem.nodeName
      ) {
        nbOfPreviousSiblings++;
      }
      sibling = sibling.previousSibling;
    }
    sibling = nodeElem.nextSibling;

    while (sibling) {
      if (sibling.nodeName === nodeElem.nodeName) {
        hasNextSiblings = true;
        break;
      }
      sibling = sibling.nextSibling;
    }

    const prefix = nodeElem.prefix ? nodeElem.prefix + ":" : "";
    const nth =
      nbOfPreviousSiblings || hasNextSiblings
        ? `[${nbOfPreviousSiblings + 1}]`
        : "";
    isFlexibleXpath = /^-?\d+$/.test(nodeElem.id.slice(-1));

    if (nodeElem.id && !isFlexibleXpath) {
      var nodeCount = document.querySelectorAll(`#${nodeElem.id}`);
      if (nodeCount.length == 1) {
        parts.push(`/*[@id="${nodeElem.id}"]`); //부모노드 중 id가 있을 경우 id를 담아준 후 노드검색을 멈춤
        break;
      } else {
        parts.push(prefix + nodeElem.localName + nth);
      }
    } else {
      parts.push(prefix + nodeElem.localName + nth);
    }

    nodeElem = nodeElem.parentNode;
  }
  return parts.length ? "/" + parts.reverse().join("/") : "";
};
