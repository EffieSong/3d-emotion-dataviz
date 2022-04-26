// UI of diary writing

import {
    RULE,
    PROMPTS
} from './scriptableObj.js'

export default class Diary {
    constructor(opts = {}) {
        this.parentWrapper = opts.parentWrapper,
            this.submitBtn = opts.submitBtn,
            this.inputBox = opts.inputBox,
            this.event_afterWritingEmotions = opts.event_afterWritingEmotions,
            this.event_afterNaming = opts.event_afterNaming,
            this.event_afterWritingThought = opts.event_afterWritingThought,

            this.offset = 400;
        this.prompt = PROMPTS;
        this.contentIndex = 0;
        this.init();

        //public property
        this.writingIsDone = false;
    }
    init() {
        this.submitBtn.addEventListener("click", () => {
            console.log("submit");
            this.addWritingContent(this.contentIndex);
            this.wrapperGoUp(this.contentIndex);
            if (this.contentIndex == 1) {
                this.event_afterWritingEmotions(this.inputBox.value, RULE);
            }
            if (this.contentIndex == 4) {
                this.event_afterNaming()
                this.finishWriting();
            };
            if (this.contentIndex == 3) this.event_afterWritingThought(this.inputBox.value);


            this.contentIndex++;
            this.nextPromptAppear(this.contentIndex);
            this.inputBox.value = "";
        });
    }
    finishWriting() {
        this.inputBox.style.display = "none";
        this.submitBtn.style.display = "none";

        //create store button

        let storeButton = document.querySelector('.storeButton');
        //after 3 seconds
        storeButton.style.display = "block";
        storeButton.addEventListener("click", () => {
            //storeButton disapear animation
            storeButton.style.visibility = 'hidden';
            this.writingIsDone = true;
        })

    }
    getStatus() {
        return this.writingIsDone
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