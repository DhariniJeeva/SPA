import React, { Component, Fragment } from 'react';
import Details from './media/details.png';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finalBankResults: [], //entries that match the JSON
            showBankResults: false,
            suggestionList: [], //entries that match user's input data
            showDropDown: false, //boolean to check whether to show suggestions or not 
            inputEntry: "", //user's entry on the search box
            cursor: 0 // to track the position
        }
    }


    //this is the function that handles the user input either by typing directly or chosen from the list 
    showResults = (chosenBank) => {
        if (chosenBank) {
            const finalBankResults = this.props.data.filter(bank => bank.name.toLowerCase() === chosenBank.toLowerCase());
            const suggestionList = this.props.data.filter(bank => bank.name.toLowerCase().indexOf(chosenBank.toLowerCase()) > -1);
            this.setState({
                finalBankResults,
                suggestionList,
                inputEntry: chosenBank
            })
        }
        else {
            this.setState({
                suggestionList: [],
                showDropDown: false,
                inputEntry: "",
                finalBankResults: [],
                cursor: 0
            })
        }
    }
    //this function is called whenever there is a change in the search box
    inputSearchChange = (e) => {
        this.setState({ showDropDown: true, showBankResults: false });
        this.showResults(e.target.value)
    }

    //this function handles the option selected from the list
    selectBankFromList = (e) => {
        const selectedBank = e.target.innerText;
        this.setState({
            inputEntry: selectedBank,
            showDropDown: false,
            showBankResults: true
        })
        this.showResults(selectedBank);
    }

    //this function takes care of 'keydown' and 'enter' while traversing through the drop down list
    keyOnChange = (e) => {
        let element = document.getElementById(this.state.cursor);
        if (e.keyCode === 38 && this.state.cursor > 0) {
            this.setState(prevState => ({
                cursor: prevState.cursor - 1
            }))
            element.scrollIntoView({ behavior: 'smooth' });
        }
        else if (e.keyCode === 40 && this.state.cursor < this.state.suggestionList.length - 1) {
            this.setState(prevState => ({
                cursor: prevState.cursor + 1
            }))
            element.scrollIntoView({ behavior: 'smooth' });
        }
        else if (e.keyCode === 13) {
            if (element) {
                let selectedBank = element.innerText;
                this.setState({
                    showDropDown: false,
                    showBankResults: true
                })
                this.showResults(selectedBank);
            }
            else {
                this.setState({ showBankResults: true })
            }
        }
    }
    //if input text matches the name of provided data, show the dropdown with suggestions, else no results found
    render() {
        return (
            <Fragment>
                <input type="text" className="search-bar" placeholder="Search here" onChange={this.inputSearchChange} value={this.state.inputEntry} onKeyDown={this.keyOnChange} />
                <SuggestionList
                    suggestionList={this.state.suggestionList}
                    showDropDown={this.state.showDropDown}
                    cursor={this.state.cursor}
                    select={this.selectBankFromList}
                />
                {this.state.showBankResults && <Results finalResults={this.state.finalBankResults} />}

            </Fragment>
        )
    }
}

//this is suggestion list view component
const SuggestionList = (props) => {
    return (
        <Fragment>
            {props.showDropDown && props.suggestionList.length > 0 &&
                <div className="suggestion-list">
                    {props.suggestionList.map((item, index) =>
                        <p key={index} id={index} className={props.cursor === index ? 'selected' : "non-selected"}
                            onClick={props.select}
                        >{item.name}</p>)

                    }
                </div>
            }
        </Fragment>
    )
}
//this is final result view component
const Results = (props) => {
    return (
        <div className="results-container">
            {props.finalResults.length > 0 ?
                <div className="results">
                    {props.finalResults.map(item =>
                        <div className="results-card"
                            key={item.name}>
                            <a href={item.url} className="more-details-icon">
                                <img src={Details} alt="more-details" />
                                <span className="tooltiptext">details</span>
                            </a>
                            <p>{item.name}</p>
                            <span>Type : {item.type.toLowerCase()}</span>
                        </div>)}
                </div>
                :
                <p className="bad-result">uh oh! no results found. Try something else</p>
            }
        </div>
    )
}