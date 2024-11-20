// Parameters // 
var experimentName = "2AFC IB Experiment - Mack and Rock, 4 Trials, Gray Background, Isoluminant Red or Blue Line Left/Right, Report Color";

// URL for Prolific 
// *** THIS MAY CHANGE FOR EACH EXPERIMENT ***
var PROLIFIC_URL = "https://app.prolific.co/submissions/complete?cc=48A0A32C";

// Other behind-the-scenes variables (not likely to be changed)
var path = "https://www.mn.perceptionresearch.org/IB_MackRock/E3";
var iti = 200; //msec
var currentTrial = 0;
var startTrialTime;
var trials = [];
var data = {};

// Parameters
var nTrials = 4;
var arms = Shuffle(['vertical', 'horizontal']);
var stimDuration = 200;
var SOA = 1500;
var blank = 500;
var shift = 150; //how many pixels to shift the cross above/below fixation 


function GenerateTrials() {
    for (let i = 0; i < nTrials; i++) {
        trials[i] = {};
        trials[i].trialNum = i;
        trials[i].longerArm = arms[Math.floor(Math.random() * arms.length)];
        trials[i].response_longerArm = "null";
        trials[i].response_yesNo = "null";
        trials[i].response_AFC = "null";
        trials[i].AFCquestion = "null";
        //for storing reaction times 
        trials[i].RT_longerArm = "null";
        trials[i].RT_yesNo = "null";
        trials[i].RT_AFC = "null";
        trials[i].RT_IBfamiliarity = "null";
        trials[i].RT_age = "null";
        trials[i].RT_ishihara = "null";
        // Replaced with 'yes' if a subject clicks 'Withdraw' at any point
        data.withdraw = "no";
        //above or below fixation is randomized for each trial 
        if (Math.random() < 0.5) {
            trials[i].aboveBelow = "above";
        } else {
            trials[i].aboveBelow = "below";
        }

        //IB trial
        if (i == nTrials - 1) {
            trials[i].AFCquestion = "reportColor";

            //1/3 of Trial 4s have no IB stimulus  
            var conditionPicker = Math.random();
            if (conditionPicker < 0.33) {
                trials[i].trialType = "IBstimulus_absent";
                trials[i].IBstimulus_color = "null";
                trials[i].IBstimulus_location = "null";

                //1/3 of Trial 4s have a blue line
            } else if (conditionPicker >= 0.33 && conditionPicker < 0.67) {
                trials[i].trialType = "IBstimulus_present";
                if (Math.random() < 0.5) {
                    trials[i].IBstimulus_color = "blue";
                    trials[i].IBstimulus_location = "right";
                } else {
                    trials[i].IBstimulus_color = "blue";
                    trials[i].IBstimulus_location = "left";
                }

                //1/3 of Trial 4s have a red line
            } else {
                trials[i].trialType = "IBstimulus_present";
                if (Math.random() < 0.5) {
                    trials[i].IBstimulus_color = "red";
                    trials[i].IBstimulus_location = "right";
                } else {
                    trials[i].IBstimulus_color = "red";
                    trials[i].IBstimulus_location = "left";
                }
            }

        } else {
            trials[i].trialType = "IBstimulus_absent";
            trials[i].IBstimulus_color = "null";
            trials[i].IBstimulus_location = "null";
        }
    }
    return trials;
}


function DrawIBStimulus() {
    if (trials[currentTrial].IBstimulus_color == "blue" && trials[currentTrial].IBstimulus_location == "right") {
        $('#IBstimulus').append('<svg height="200" width="600"><line x1="590" y1="0" x2="590" y2="200" style="stroke:rgb(0,0,136);stroke-width:3" /></svg>');

    } else if (trials[currentTrial].IBstimulus_color == "blue" && trials[currentTrial].IBstimulus_location == "left") {
        $('#IBstimulus').append('<svg height="200" width="600"><line x1="10" y1="0" x2="10" y2="200" style="stroke:rgb(0,0,136);stroke-width:3" /></svg>');

    } else if (trials[currentTrial].IBstimulus_color == "red" && trials[currentTrial].IBstimulus_location == "right") {
        $('#IBstimulus').append('<svg height="200" width="600"><line x1="590" y1="0" x2="590" y2="200" style="stroke:rgb(147,0,0);stroke-width:3" /></svg>');

    } else if (trials[currentTrial].IBstimulus_color == "red" && trials[currentTrial].IBstimulus_location == "left") {
        $('#IBstimulus').append('<svg height="200" width="600"><line x1="10" y1="0" x2="10" y2="200" style="stroke:rgb(147,0,0);stroke-width:3" /></svg>');

    } else {
        alert('There is an error with DrawIBStimulus function. If you are a participant, please copy this error message, then scroll down and click WITHDRAW and paste the message in the comment box before submitting.');
    }
}


function DrawCross() {
    //is the vertical or horizontal arm longer on this trial? 
    if (trials[currentTrial].longerArm == "vertical") {
        var cross = document.getElementById('cross1');
    } else {
        var cross = document.getElementById('cross2');
    }
    //is the cross above or below fixation? 
    if (trials[currentTrial].aboveBelow == "above") {
        $(cross).css({
            "transform": "translate(0px, " + -shift + "px)"
        });
    } else {
        $(cross).css({
            "transform": "translate(0px, " + shift + "px)"
        });
    }
    //show it 
    $(cross).show();
}


function NextTrial() {
    trials[currentTrial].trialTime = performance.now() - startTrialTime;
    $('#pleaseType').hide();
    $('#2AFC').hide();
    $('#continueButton').hide();
    currentTrial++;
    PresentTrial();
}


//Functions to change 2AFC questions and options and save responses 
function LongerArm() {
    $('#question1').html('<p style="font-size:16pt"></p>When the cross appeared on the last trial, which arm was <em>longer</em>? <p style="font-size:16pt"></p>(Please guess if you need to.)<br><br>');
    $('label[for=option1]').html('Vertical');
    $('label[for=option2]').html('Horizontal');
    $('#option1').val('vertical');
    $('#option2').val('horizontal');
    $('#2AFC').show();
    $('input[name=options]').show();
    $('#continueButton').show();
}

function YesNo() {
    $('#question1').html("<p style='font-size:16pt;'></p>Did you notice anything unusual on the last trial which wasn't there on previous trials?<br><br>");
    $('label[for=option1]').html('Yes');
    $('label[for=option2]').html('No');
    $('#option1').val('yes');
    $('#option2').val('no');
    $('#2AFC').show();
    $('input[name=options]').show();
    $('#continueButton').show();
}

function AFC() {
    $('#question1').html('<p style="font-size:16pt"></p>The last trial you just saw contained one extra element — a vertical line on one side of the box. What color was the extra line? If you don’t know, or don’t think any line appeared, take your best guess.<br><br>');
    $('label[for=option1]').html('<strong><span style="color:rgb(147,0,0)">Red</span></strong>');
    $('label[for=option2]').html('<strong><span style="color:rgb(0,0,136)">Blue</span></strong>');
    $('#option1').val('red');
    $('#option2').val('blue');
    $('#2AFC').show();
    $('input[name=options]').show();
    $('#continueButton').show();
}

function IBfamiliarity() {
    $('#question1').html('<p style="font-size:16pt"></p>Have you heard of experiments where something (a gorilla, for example) appears unexpectedly when you were not paying attention?<br><br>');
    $('label[for=option1]').html('Yes');
    $('label[for=option2]').html('No');
    $('#option1').val('yes');
    $('#option2').val('no');
    $('#2AFC').show();
    $('input[name=options]').show();
    $('#continueButton').show();
}

function Age() {
    $('#continueButton').hide();
    $('#2AFC').hide();
    $('#question2').html('<p style="font-size:16pt"></p>What is your age? (Please type.)<br><br>');
    $('#pleaseType').show();
}

function Ishihara() {
    $('#continueButton').hide();
    $('#2AFC').hide();
    $('#question2').html('<p style="font-size:16pt"></p>What number do you see in the circle below?<br><br>');
    $('#pleaseType').show();
    $('#Ishihara').show();
}


var t3;

function AskQuestions() {
    t3 = performance.now();
    //ask the right question 
    if (stage == 1) {
        window.requestAnimationFrame(LongerArm);
    } else if (stage == 2 && currentTrial == 3) {
        window.requestAnimationFrame(YesNo);
    } else if (stage == 3 && currentTrial == 3) {
        window.requestAnimationFrame(AFC);
    } else if (stage == 4 && currentTrial == 3) {
        window.requestAnimationFrame(IBfamiliarity);
    } else if (stage == 5 && currentTrial == 3) {
        window.requestAnimationFrame(Age);
    } else if (stage == 6 && currentTrial == 3) {
        window.requestAnimationFrame(Ishihara);
    } else if (stage == 7 && currentTrial == 3) {
        window.requestAnimationFrame(function () {
            $('#2AFC').hide();
            $('#pleaseType').hide();
            NextTrial();
        });
    } else {
        NextTrial();
    }
}


function ShowButton() {
    $('#continueButton').show();
}


var RT;

function SaveResponse() {
    RT = performance.now() - t3;
    //get answers to questions with radio buttons 
    if ($("#2AFC").is(":visible")) {
        let question = $('input[name=options]').val();
        let response = document.querySelector('input[name="options"]:checked').value;
        if (stage == 1) {
            trials[currentTrial].RT_longerArm = RT;
            trials[currentTrial].response_longerArm = response;
        } else if (stage == 2) {
            trials[currentTrial].RT_yesNo = RT;
            trials[currentTrial].response_yesNo = response;
        } else if (stage == 3) {
            trials[currentTrial].RT_AFC = RT;
            trials[currentTrial].response_AFC = response;
        } else if (stage == 4) {
            trials[currentTrial].RT_IBfamiliarity = RT;
            data.IBfamiliarity = response;
        }
        stage++;
        $('input[name=options]').attr('checked', false);
        AskQuestions();
        //get answers to questions with comment box input 
    } else if ($("#pleaseType").is(":visible")) {
        if (stage == 5) {
            trials[currentTrial].RT_age = RT;
            data.age = $('#textBox').val();
        } else if (stage == 6) {
            trials[currentTrial].RT_ishihara = RT;
            data.ishihara = $('#textBox').val();
        } else {
            alert('Stage is wrong, nothing to type here. If you are a participant, please copy this error message, then scroll down and click WITHDRAW and paste the message in the comment box before submitting.');
        }
        stage++;
        $('#textBox').val("");
        AskQuestions();
        //just move to the next screen (end or additional instructions)
    } else {
        stage++;
        AskQuestions();
    }
}


// For animation 
var requestID = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var t0;
var elapsedtime;
var stage;

function animate() {
    $('#pleaseFixate').hide();
    t1 = performance.now();
    elapsedtime = t1 - t0;
    if (elapsedtime >= SOA && elapsedtime < SOA + stimDuration) {
        DrawCross();
        if (currentTrial == 3) {
            if (trials[currentTrial].trialType == "IBstimulus_present") {
                DrawIBStimulus();
            }
        }
    } else if (elapsedtime >= SOA + stimDuration) {
        $('#containerContent').hide();
        if (elapsedtime >= SOA + stimDuration + blank) {
            document.body.style.cursor = 'default'; //show the cursor 
            AskQuestions();
        }
    }
    if (elapsedtime <= SOA + stimDuration + blank) {
        window.requestAnimationFrame(animate);
    }
}


function PresentTrial() {
    //hide the cursor 
    document.body.style.cursor = 'none';
    //make sure page is scrolled to the top 
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    $('.cross').hide();
    stage = 1;
    //display a trial or call DoneExperiment()
    if (currentTrial < nTrials) {
        $('#container').show();
        $('#containerContent').show();
        $('#fixation').show();
        $('#pleaseFixate').show();
        startTrialTime = performance.now();
        //the trial runs when they press the spacebar   
        $(window).keypress(function (e) {
            if (e.which === 32 && e.target == document.body) {
                e.preventDefault();
                t0 = performance.now();
                window.requestAnimationFrame(animate);
            }
        });
    } else {
        DoneExperiment();
        setTimeout(function () {
            $('#submitButton').click();
        }, 120000); //auto-submit after 12 seconds
    }

}

// Fullscreen function 
var elem = document.documentElement;

function OpenFullScreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera*/
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function StartExperiment() {
    $('#startButton').hide();
    $('#instructions').hide();
    $('#continueButton').hide();
    $('#pleaseType').hide();
    PresentTrial();
    OpenFullScreen();
}


function DoneExperiment() {
    document.body.style.cursor = 'default'; //show the cursor
    $('#submitButton').text('Submit');
    $('#experiment').hide();
    $('#container').hide();
    $('#continueButton').hide();
    $('#doneText').show();
    $('#commentBox').show();
    $('#submitButton').click(function () {
        $('#doneText').hide();
        $('#submitButton').hide();
        var commentText = document.getElementById('commentBox').value;
        $('#comments').val(commentText);
        
        //save the data 
        //NOTE: any data NOT in 'trials' must be added here to be saved 
        data.trials = trials;
        data.experimentName = experimentName;
        data.path = path;
        var browserInfo = getBrowser();
        data.browserName = browserInfo[0];
        data.browserInfo = browserInfo[1];
        data.displayWindowHeight = $(window).height();
        data.displayWindowWidth = $(window).width();
        data.displayScreenHeight = screen.height;
        data.displayScreenWidth = screen.width;
        data.totalTime = performance.now();
        var d = new Date();
        data.date = d.toJSON().substring(0, 10);
        data.comments = commentText;

        //for Prolific 
        let urlParams = new URLSearchParams(window.location.search);
        data.prolificPID = urlParams.get("PROLIFIC_PID");
        data.studyID = urlParams.get("STUDY_ID");
        data.sessionID = urlParams.get("SESSION_ID");

        //post data to the server 
        $.post("log_data.py", {
            subjectId: data.prolificPID,
            dataString: JSON.stringify(data)
        });

        //redirect participants to Prolific 
        $("#endInstructions").text("All done - thank you for participating!\r\n" +
            "You should be redirected to Prolific in a " +
            "few seconds.\r\nIf you aren't automatically " +
            "redirected, please click the link below.");
        $("#prolific_link").attr("href", PROLIFIC_URL);
        $("#prolific_link").text("Click here to return to Prolific");
        $("#endInstructions").show();
        let redirectTime = 5; //seconds
        let redirectTick = 1000; //milliseconds
        let countdownInterval = setInterval(() => {
            redirectTime--;
            $("#endInstructions").text("All done - thank you for participating!\r\n" +
                "You should be redirected to Prolific in " +
                redirectTime + " seconds." +
                "\r\nIf you aren't automatically redirected, " +
                "please click the link below.");
            $("#endInstructions").show();
            if (redirectTime <= 0) {
                clearInterval(countdownInterval);
                window.location = PROLIFIC_URL;
            }
        }, redirectTick);
    });
}


// now let's go!
$(document).ready(function () {
    if (navigator.userAgent.indexOf('MSIE') != -1) {
        $('body').html('Unfortunately this HIT does not work in IE. It works in Chrome, Firefox or Safari. Sorry!');
    }
    trials = GenerateTrials();
    $('body').css("width", "800px");
});
