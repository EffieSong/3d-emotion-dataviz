// UI of diary writing

import {
    RULE,PROMPTS
} from './scriptableObj.js'

export default class Diary {
    constructor(opts = {}) {
        this.parentWrapper = opts.parentWrapper,
        this.submitBtn = opts.submitBtn,
        this.inputBox = opts.inputBox,
        this.callback = opts.callback,

        this.offset = 400;
        this.prompt = PROMPTS;
        this.contentIndex = 0;
        this.init();
    }
    init() {
        this.submitBtn.addEventListener("click", () => {
            this.addWritingContent(this.contentIndex);
            this.wrapperGoUp(this.contentIndex);
           if (this.contentIndex == 1) this.callback(this.inputBox.value,RULE);

            this.contentIndex++;
            this.nextPromptAppear(this.contentIndex);
            this.inputBox.value = "";
        });
    }

    addWritingContent(promptIndex) {
        let currContentWrapper = document.querySelector(`#contentWrapper${promptIndex}`);
        let myWriting = document.createElement('p');
        myWriting.innerText = this.inputBox.value; //这一行有bug
        currContentWrapper.appendChild(myWriting);
        // console.log(currContentWrapper);
        promptIndex < 1 || this.parentWrapper.appendChild(currContentWrapper);
    }

    nextPromptAppear(index) {
        let nextContentWrapper = document.createElement('div');
        nextContentWrapper.id = `contentWrapper${index}`
        let nextPrompt = document.createElement('p');
        nextPrompt.className = "prompt";
        nextPrompt.innerHTML = PROMPTS[index];
        nextContentWrapper.appendChild(nextPrompt);
        this.parentWrapper.appendChild(nextContentWrapper);
    }
    wrapperGoUp(index) {
        let currContentWrapper = document.querySelector(`#contentWrapper${index}`);
        let height = currContentWrapper.clientHeight;
        this.offset -= height;
        // console.log(offset);
        this.parentWrapper.style.marginTop = `${this.offset}px`;
    }
    
}