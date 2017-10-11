import * as  React from 'react';
import * as ReactDom from 'react-dom';
import PropTypes from 'prop-types';

export default class NogiBox extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.load = this.load.bind(this);
        this.STARTMENUE = 1;
        this.DURINGGAME = 2;
        this.CHECKANSWER = 3;
        this.RESULT = 4;
        this.state = {
            mode: this.STARTMENUE,
            inputName: '',
            inputYear: '',
            inputMonth: '',
            inputDay: '',
            inputHeight: '',
            memberName: '',
            memberBirthday: '',
            memberHeight: '',
            memberUrl: '',
            nameState: false,
            birthdayState: false,
            heightState: false,
            count: 0,
            result: 0,
        }
    }

    handleStartClick() {
        this.load();
        this.setState({mode: this.DURINGGAME});
        this.setState({count: this.state.count + 1});
    }

    handleAnswerClick() {
        this.checkAnswer();
        this.setState({mode: this.CHECKANSWER});
        //console.log(this.state.inputName);
        //console.log(this.state.inputYear);
        //console.log(this.state.inputMonth);
        //console.log(this.state.inputDay);
        //console.log(this.state.inputHeight);
    }

    handleResultClick() {
        this.setState({count: 0});
        this.setState({mode: this.RESULT});
    }

    handleRestartClick() {
        this.setState({result: 0});
        this.setState({mode: this.STARTMENUE});
    }

    load() {
        fetch('/api/member', {credentials: 'same-origin'})
            .then(x => x.json())
            .then(json => {
                if (json == null) {
                    return;
                }
                this.setState({memberName: json.name});
                this.setState({memberBirthday: json.birthday});
                this.setState({memberHeight: json.height});
                this.setState({memberUrl: json.pictureUrl});
            })
            .catch(err => {
                console.error('fetch error', err);
            });
    }

    checkAnswer() {
        var month;
        var day;
        var nameState = false;
        var heightState = false;
        var birthdayState = false;
        this.setState({nameState: false});
        this.setState({birthdayState: false});
        this.setState({heightState: false});
        if (this.state.inputName == this.state.memberName) {
            this.setState({nameState: true});
            nameState = true;
        }
        if (this.state.inputHeight == this.state.memberHeight) {
            this.setState({heightState: true})
            heightState = true;
        }
        if (this.state.inputDay.length < 2) {
            day = '0' + this.state.inputDay;
            this.setState({inputDay: day})
        } else {
            day = this.state.inputDay;
        }
        if (this.state.inputMonth.length < 2) {
            month = '0' + this.state.inputMonth;
            this.setState({inputMonth: month});
        } else {
            month = this.state.inputMonth;
        }
        var birthday = this.state.inputYear + month + day;
        if (birthday == this.state.memberBirthday) {
            this.setState({birthdayState: true});
            birthdayState = true;
        }
        if (nameState && birthdayState && heightState) {
            this.setState({result: this.state.result + 1});
        }
        month = '';
        day = '';
        this.setState({inputMonth: ''});
        this.setState({inputName: ''});
        this.setState({inputYear: ''});
        this.setState({inputDay: ''});
        this.setState({inputHeight: ''});
    }

    handleNameChange(event) {
        this.setState({inputName: event.target.value});
    }

    handleYearChange(event) {
        this.setState({inputYear: event.target.value});
    }

    handleMonthChange(event) {
        this.setState({inputMonth: event.target.value});
    }

    handleDayChange(event) {
        this.setState({inputDay: event.target.value});
    }

    handleHeightChange(event) {
        this.setState({inputHeight: event.target.value});
    }

    render() {

        let main = null;
        var imageUrl;
        var picStyle;

        //start menu
        if (this.state.mode == this.STARTMENUE) {
            imageUrl = 'https://iwiz-chie.c.yimg.jp/im_siggLYZ9lFlDpBKeF5fhrte5Bg---x320-y320-exp5m-n1/d/iwiz-chie/ans-271868498'
            picStyle = {
                backgroundImage: 'url(' + imageUrl + ')'
            };
            main = (
                <div>
                    <div className="first-desc">You can memorize Nogizaka's members on this site. Enjoy!</div>
                    <div className="pictureBox" style={picStyle}></div>
                    <div className="btn-box">
                        <button className="standard-btn" onClick={this.handleStartClick.bind(this)}>
                            Press to Start Memorizing!
                        </button>
                    </div>
                </div>
            );
        }

        //question screen
        if (this.state.mode == this.DURINGGAME) {
            imageUrl = this.state.memberUrl;
            picStyle = {
                backgroundImage: 'url(' + imageUrl + ')'
            };

            main = (
                <div className="form-box">
                    <div className="first-desc">What is her name, birthday and height?</div>
                    <div className="pictureBox" style={picStyle}></div>
                    <form>
                        <label>
                            Name:
                            <input className="form-control-name" type="text" value={this.state.inputName}
                                   onChange={this.handleNameChange}
                                   name="name"/>
                        </label>
                    </form>
                    <form>
                        <label className="birthday-box">
                            <div className="birth">
                                Year:
                                <input className="form-control" type="text" value={this.state.inputYear}
                                       onChange={this.handleYearChange}
                                       name="name"/>
                            </div>
                            <div className="birth">
                                Month:
                                <input className="form-control" type="text" value={this.state.inputMonth}
                                       onChange={this.handleMonthChange}
                                       name="name"/>
                            </div>
                            <div className="birth">
                                Day:
                                <input className="form-control" type="text" value={this.state.inputDay}
                                       onChange={this.handleDayChange} name="name"/>
                            </div>
                        </label>
                    </form>
                    <form>
                        <label>
                            height:
                            <input className="form-control-name" type="text" value={this.state.inputHeight}
                                   onChange={this.handleHeightChange}
                                   name="name"/>
                        </label>
                    </form>
                    <div className="btn-box">
                        <button className="standard-btn" onClick={this.handleAnswerClick.bind(this)}>
                            Check your answer
                        </button>
                    </div>
                </div>
            );
        }

        //answer screen
        if (this.state.mode == this.CHECKANSWER) {

            let btn = null;
            let answerBox = null;
            imageUrl = this.state.memberUrl;
            picStyle = {
                backgroundImage: 'url(' + imageUrl + ')'
            };
            if (this.state.nameState && this.state.birthdayState && this.state.heightState) {
                answerBox = (
                    <div>
                        You got it!
                    </div>
                );
            } else {
                answerBox = (
                    <div>
                        Wrong Answer....
                    </div>
                );

            }

            if (this.state.count > 4) {
                btn = (
                    <button className="standard-btn" onClick={this.handleResultClick.bind(this)}>
                        See the Result
                    </button>
                );
            } else {
                btn = (
                    <button className="standard-btn" onClick={this.handleStartClick.bind(this)}>
                        Go to next question!
                    </button>
                );
            }
            main = (
                <div>
                    <div className="first-desc">{answerBox}</div>
                    <div className="pictureBox" style={picStyle}></div>
                    <div className="first-desc">
                        {this.state.memberName}
                    </div>
                    <div className="btn-box">
                        {btn}
                    </div>
                </div>
            );
        }
        //result screen
        if (this.state.mode == this.RESULT) {
            main = (
                <div>
                    <div className="first-desc">Your game is finished!</div>
                    <div className="result">
                        Your score is {this.state.result} / 5!!
                        You should make efforts
                    </div>
                    <div className="btn-box">
                        <button className="standard-btn" onClick={this.handleRestartClick.bind(this)}>
                            Press to Start Memorizing!
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {main}
            </div>
        );
    }
}
