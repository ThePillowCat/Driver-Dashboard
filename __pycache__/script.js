let data;


let arm1Length = 100;
let arm2Length = 75;
let gripperLength = 25;
let gripperWidth = 5;
let armJointSize = 10;
let arm1Angle, arm2Angle;
let gripperClosed;
let angle = 0;

var feedbackForm, historyForm, themesForm, threeDForm;
var threeDCanvas, DRIVERLabel;
var armCanvas;
var balanceCanvas;
var scoreCanvas;
var rot = 0;
var formManager;
var MUSTANGFormStyle, MUSTANGControlStyle;
var formCursor;

var scoreForm;
var armForm;
var DRIVERnameTextBox

var engaged = false;
var score;
var docked;

var fon

var LEDcanvas;
var LEDform;

var g;
var shape = 0
var lastState = false;
var lastState = false
var img

var engegedState
var chargeState

w = 400;
h = 400;


// swerve

// Wheel angle of rotation and magnitude of each wheel
wheelA = [10, 20];
wheelB = [10, 20];
wheelC = [10, 20];
wheelD = [10, 20];

// Rotation of whole robot
totRotation = 0;

//2D list of all wheels
wheels = [wheelA, wheelB, wheelC, wheelD];


function preload() {
	MUSTANGFormStyle = new P5FormStyle();
	MUSTANGControlStyle = new P5ControlStyle();
	formCursor = new P5Cursor();
	formManager = new P5FormManager();

	MUSTANGFormStyle.borderColor = color(255, 70, 0);

	MUSTANGFormStyle.inactiveTitleBarColor =
		MUSTANGFormStyle.titleBarButtonColor =
		MUSTANGFormStyle.titleBarColor = 
		MUSTANGFormStyle.ghostColor = color(0, 161, 255);

	MUSTANGFormStyle.titleBarFontColor = color(255);

	MUSTANGFormStyle.windowShadowColor = color(0, 161, 255, 150);

	MUSTANGControlStyle.buttonClickedBorderColor =
		MUSTANGControlStyle.listBoxSelectedColor = 
		MUSTANGControlStyle.checkBoxCheckColor =
		MUSTANGControlStyle.listBoxBorderColor =
		MUSTANGControlStyle.textBoxBorderColor =
		MUSTANGControlStyle.buttonBorderColor = color(0, 161, 255);

	MUSTANGControlStyle.buttonTextColor =
		MUSTANGControlStyle.buttonClickedColor = color(255, 70, 0);
}

function setup() {

	setInterval(function() {
		httpGet('http://localhost:3000/', 'jsonp', function(data) {
		  response = data;
		  console.log(response);
		});
	  }, 20);

	img = loadImage('rainbow.png');
	fon = loadFont('p5forms_data/ShareTechMono-Regular.ttf')

	arm1Angle = 340;
	arm2Angle = 0;
	gripperClosed = false;

	angleMode(DEGREES)

	grid = [[0,0,0,0,0,0,0,0,0],
           [0,0,0,0,0,0,0,0,0],                 
		   [0,0,0,0,0,0,0,0,0]]

	modeScored = [[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],                 
	[0,0,0,0,0,0,0,0,0]]

	docked = [false, false]
	engaged = [false, false]

	score = 0;
	links = 0;
	mode = "auto"
	temp = 0

	resizeCanvas(1920,1080, P2D);
	noCursor();

	var orderConfirmation_close = function(button) {
		if (button == "Yes") {
			msgbox.showMsgBox(feedbackForm, "Feedback info", "Your note has been confirmed!",	MSGBOX_INFO_ICON, ["OK"], null);

			if (attachNotesCheckBox.checked) {
				historyListBox.items.push(DRIVERnameTextBox.text + " | " + notesTextBox.text);
			}else{
				historyListBox.items.push("Private" + " | " + notesTextBox.text);
			}

		} else {
			msgbox.showMsgBox(feedbackForm, "Feedback info", "Your note has been canceled!", MSGBOX_STOP_ICON, ["OK"], null);
		}
	}

	var cookiesButton_onClick = function() {
		if (DRIVERnameTextBox.text == "") {
			msgbox.showMsgBox(feedbackForm, "Warning", "Please enter your name", MSGBOX_WARN_ICON, ["OK"], null);
		} else {
			msgbox.showMsgBox(feedbackForm, "Question",
				"Your feedback has been noted! Would you like to confirm it?", MSGBOX_QUESTION_ICON, ["No", "Yes"], orderConfirmation_close);
		}
	};

	var prevOrdersButton_onClick = function() {
		formManager.showForm(historyForm);
	}

	var themeButton_onClick = function() {
		formManager.showForm(themesForm);
	}

	var MUSTANGThemeButton_onClick = function() {
		formManager.windowStyle = MUSTANGFormStyle;
		formManager.controlStyle = MUSTANGControlStyle;
	}

	var normalThemeButton_onClick = function() {
		formManager.windowStyle = DEFAULT_WINDOW_STYLE;
		formManager.controlStyle = DEFAULT_CONTROL_STYLE;
	}

	var removePreviousOrderButton_onClick = function() {
		historyListBox.items.splice(historyListBox.selectedItem, 1);
	}

	var msgbox = new P5MsgBox();

	feedbackForm = new P5Form();
	feedbackForm.title = "Settings";
	feedbackForm.minw = feedbackForm.w = 220;
	feedbackForm.minh = feedbackForm.h = 205;
	feedbackForm.x = 400;
	feedbackForm.y = 240;

	var orderingInfoLabel = new P5Label();
	orderingInfoLabel.text = "\n\n" +
		"Driver Name:";
	orderingInfoLabel.w = 210;
	orderingInfoLabel.h = 50;
	orderingInfoLabel.anchorRight = true;

	var cookiesButton = new P5Button();
	cookiesButton.anchorRight = true;
	cookiesButton.text = "Submit Feedback";
	cookiesButton.x = 5;
	cookiesButton.y = 90;
	cookiesButton.w = 205;
	cookiesButton.onClick = cookiesButton_onClick;

	var prevOrdersButton = new P5Button();
	prevOrdersButton.anchorRight = true;
	prevOrdersButton.text = "Previous Feedback";
	prevOrdersButton.x = 5;
	prevOrdersButton.y = 120;
	prevOrdersButton.w = 205;
	prevOrdersButton.onClick = prevOrdersButton_onClick;

	var themeButton = new P5Button();
	themeButton.anchorRight = true;
	themeButton.text = "Change form theme";
	themeButton.x = 5;
	themeButton.y = 150;
	themeButton.w = 205;
	themeButton.onClick = themeButton_onClick;

	var attachNotesCheckBox = new P5CheckBox();
	attachNotesCheckBox.x = 5;
	attachNotesCheckBox.y = 60;
	attachNotesCheckBox.w = 90
	attachNotesCheckBox.h = 16;
	attachNotesCheckBox.text = "Notes:";

	DRIVERnameTextBox = new P5TextBox();
	DRIVERnameTextBox.anchorRight;
	DRIVERnameTextBox.maxLength = 16;
	DRIVERnameTextBox.x = 100;
	DRIVERnameTextBox.y = 25;

	var notesTextBox = new P5TextBox();
	notesTextBox.anchorRight = true;
	notesTextBox.multiline = true;
	notesTextBox.x = 100;
	notesTextBox.y = 55;
	notesTextBox.w = 110;

	feedbackForm.container.toolTip.addToolTip(notesTextBox, "Add feedback note");
	feedbackForm.container.toolTip.addToolTip(cookiesButton, "Submit Feedback");

	feedbackForm.container.addControl(orderingInfoLabel);
	feedbackForm.container.addControl(cookiesButton);
	feedbackForm.container.addControl(prevOrdersButton);
	feedbackForm.container.addControl(DRIVERnameTextBox);
	feedbackForm.container.addControl(notesTextBox);
	feedbackForm.container.addControl(themeButton);
	feedbackForm.container.addControl(attachNotesCheckBox);

	historyForm = new P5Form();
	historyForm.title = "Previous Feedback";
	historyForm.container.backColor = color(255, 255, 200);
	historyForm.minw = historyForm.w = 205;
	historyForm.minh = historyForm.h = 220;

	var historyInfoLabel = new P5Label();
	historyInfoLabel.text = "You can view previous feedback on this list";
	historyInfoLabel.anchorRight = true;
	historyInfoLabel.w = 190
	historyInfoLabel.h = 30;

	var historyListBox = new P5ListBox();
	historyListBox.anchorRight = true;
	historyListBox.anchorBottom = true;
	historyListBox.x = 5;
	historyListBox.y = 50;
	historyListBox.w = 190;
	historyListBox.h = 110;

	var removePreviousOrderButton = new P5Button();
	removePreviousOrderButton.text = "Remove";
	removePreviousOrderButton.anchorBottom = true;
	removePreviousOrderButton.anchorTop = false;
	removePreviousOrderButton.x = 5;
	removePreviousOrderButton.y = 165;
	removePreviousOrderButton.onClick = removePreviousOrderButton_onClick;

	historyForm.container.addControl(historyInfoLabel);
	historyForm.container.addControl(historyListBox);
	historyForm.container.addControl(removePreviousOrderButton);

	themesForm = new P5Form();
	themesForm.title = "Themes";
	themesForm.w = 180;
	themesForm.h = 60;
	themesForm.removeWindowIcon(WND_MAXIMIZE_ICON);
	themesForm.enableResizing = false;

	var normalThemeButton = new P5Button();
	normalThemeButton.text = "Classic";
	normalThemeButton.onClick = normalThemeButton_onClick;

	var MUSTANGThemeButton = new P5Button();
	MUSTANGThemeButton.text = "MUSTANG";
	MUSTANGThemeButton.x = 90;
	MUSTANGThemeButton.y = 5;
	MUSTANGThemeButton.onClick = MUSTANGThemeButton_onClick;

	themesForm.container.addControl(normalThemeButton);
	themesForm.container.addControl(MUSTANGThemeButton);

	threeDForm = new P5Form();
	threeDForm.title = "3D Canvas";
	threeDForm.w = 500;
	threeDForm.h = 350;
	threeDForm.x = 50;
	threeDForm.y = 50;

	threeDCanvas = new P5Canvas();
	threeDCanvas.canvasRenderer = WEBGL;
	threeDCanvas.w = 500 - 2 * threeDForm.borderWidth;
	threeDCanvas.h = 350 - 2 * threeDForm.borderWidth - threeDForm.titleBarHeight;
	threeDCanvas.x = threeDCanvas.y = 0;
	threeDCanvas.anchorRight = threeDCanvas.anchorBottom = true;

	DRIVERLabel = new P5Label();

	threeDForm.container.addControl(threeDCanvas);
	threeDForm.container.addControl(DRIVERLabel);createCanvas(1280, 720, P2D);
	
	// Create a canvas clear function
	var clearCanvas = function(object) {	
		// Get the drawing surface
		var c = object.canvas;
	
		if(object == balanceCanvas){
			if(Math.abs(angle)<=2){
				c.background(0,200,0)
			}
			else{
				c.background(200,0,0)
			}
		}else{
			// Render a white background
			c.background(220);
		}
	
		// Disable fill
		c.noFill();
	}
	
	// Create the GUI
	
	var armForm = new P5Form();
	
	armForm.x = 650;
	armForm.y = 50;
	armForm.w = 400;
	armForm.h = 400;
	armForm.container.backColor = color(230, 255, 230);
	armForm.title = "Arm";
	
	armCanvas = new P5Canvas();
	armCanvas.w = 380;
	armCanvas.h = 360;
	armCanvas.x = 10;
	
	
	
	armForm.container.addControl(armCanvas);	
	
	// Show the form
	formManager.showForm(armForm);
	
	// Clear the canvas
	clearCanvas(armCanvas);

	var balanceForm = new P5Form();
	
	balanceForm.x = 1350;
	balanceForm.y = 50;
	balanceForm.w = 400;
	balanceForm.h = 400;
	balanceForm.container.backColor = color(230, 255, 230);
	balanceForm.title = "Balance";
	
	balanceCanvas = new P5Canvas();
	balanceCanvas.w = 380;
	balanceCanvas.h = 360;
	balanceCanvas.x = 10;
	
	
	
	balanceForm.container.addControl(balanceCanvas);	
	
	clearCanvas(balanceCanvas);

	scoreForm = new P5Form();
	
	scoreForm.x = 1350;
	scoreForm.y = 30;
	scoreForm.w = 820*0.8;
	scoreForm.h = 440*0.8;
	scoreForm.container.backColor = color(220);
	scoreForm.title = "Scoring Tracker";
	
	scoreCanvas = new P5Canvas();
	scoreCanvas.w = 800;
	scoreCanvas.h = 400;
	scoreCanvas.x = 10;
	

	LEDform = new P5Form();

	LEDform.x = 1;
	LEDform.y = 3;
	LEDform.w = 200;
	LEDform.h = 200;
	LEDform.container.backColor = color(220);
	LEDform.title = "LED";
	
	LEDcanvas = new P5Canvas();
	LEDcanvas.w = 180;
	LEDcanvas.h = 180;

	scoreForm.container.addControl(scoreCanvas);	
	LEDform.container.addControl(LEDcanvas)
	
	// Show the form
	formManager.showForm(scoreForm);
	
	// Clear the canvas
	clearCanvas(scoreCanvas);

	swerveForm = new P5Form();
	
	swerveForm.x = 1350;
	swerveForm.y = 30;
	swerveForm.w = 420;
	swerveForm.h = 420;
	swerveForm.container.backColor = color(220);
	swerveForm.title = "Swerve";
	
	swerveCanvas = new P5Canvas();
	swerveCanvas.w = 400;
	swerveCanvas.h = 400;
	swerveCanvas.x = 10;
	
	
	
	swerveForm.container.addControl(swerveCanvas);	

	// Show the form
	formManager.showForm(scoreForm);
	
	// Clear the canvas
	clearCanvas(scoreCanvas);

	formManager.showForm(threeDForm);
	formManager.showForm(feedbackForm);
	formManager.showForm(armForm);
	formManager.showForm(balanceForm);
	formManager.showForm(scoreForm);
	formManager.showForm(swerveForm);
	formManager.showForm(LEDform);


	windowResized();
}

function draw() {
	background(220);

	arm1Angle = response[0].arm1Angle;
	arm2Angle = response[0].arm2Angle;
	angle = response[1].balanceAngle;
	//shape = response[2].colorState;

	var c = threeDCanvas.canvas;

	DRIVERLabel.text = threeDCanvas.mouseX + ";" + threeDCanvas.mouseY + "\n(" + c.width + " x " + c.height + ")";

	c.noFill();
	c.stroke(1);

	c.clear();
	c.background(200);

	c.push();

	c.rotateX(rot);
	c.rotateY(rot * 2);
	c.rotateZ(rot * 3);
	c.box(100);

	c.pop();

	rot += 0.01;
	
	var d  = armCanvas.canvas;

	d.translate(190, 180);

	// Base
	d.fill(255);
	d.stroke(0);
	d.strokeWeight(2);
	d.rect(-50, 0, 100, 20);
	d.ellipse(0, 0, armJointSize);

	// First arm
	d.rotate(radians(arm1Angle));
	d.line(0, 0, arm1Length, 0);

	// Second arm
	d.translate(arm1Length, 0);
	d.ellipse(0, 0, armJointSize);
	d.rotate(radians(arm2Angle));
	d.line(0, 0, arm2Length, 0);

	// Gripper
	d.translate(arm2Length, 0);
	d.strokeWeight(gripperWidth);
	if (gripperClosed) {
		d.line(0, 0, 12.5, 0);
	} else {
		let gripperAngle = 105;
		let gripperX = -gripperLength / 2 * cos(radians(gripperAngle));
		let gripperY = -gripperLength / 2 * sin(radians(gripperAngle));
		d.line(0, 0, gripperX, gripperY);
		gripperX = gripperX;
		gripperY = -gripperY;
		d.line(0, 0, gripperX, gripperY);
	}

	var e = balanceCanvas.canvas;

	e.strokeWeight(0)
	e.textSize(28)
	e.textFont(fon)
	e.text("angle: " + str(angle % 360), 160, 340)

	e.strokeWeight(4)
	e.stroke(25)
	e.line(0, 200, 400, 200)
	e.stroke(0)
	e.translate(200, 200)

	e.fill(255)
	e.rotate(angle)

	e.rectMode(RADIUS)
	e.rect(0, 0, 90, 18, 10)
	e.fill(0)
	e.ellipse(0, 0, 10, 10)
	e.strokeWeight(8)
	e.line(0, -18, 0, -150)
	e.line(0, -150, 30, -40)
	e.strokeWeight(2)

	var f = scoreCanvas.canvas;

	f.background(220)

	for (i = 0; i < 3; i+=1) {
		for (j = 0; j < 9; j+=1) {
		  if (grid[i][j] === 1) {
			f.fill("#e08000")
		  }
		  if (j % 3 == 1) {
			  if (grid[i][j] === 1) {
				  f.fill("#5b2dc6")
			  }
			  f.rect((j*80+50)*0.8, (i*100+120)*0.8, 60*0.8, 60*0.8)
		  }
		  else {
			f.triangle((j*80+80)*0.8, (i*100+120)*0.8, (j*80+50)*0.8, (i*100+180)*0.8, (j*80+110)*0.8, (i*100+180)*0.8)
		  }
		  f.fill("white")
		}
	  }
	  UI(f);

	  g = LEDcanvas.canvas;
	  g.rectMode(RADIUS)
  
	  g.background(220);
		currentState = mouseIsPressed
	  if(currentState != lastState && currentState === true && onHitboxV2(10,10,180,180)){
		  if(shape == 3)shape = 0
		  else shape += 1
	  }
	  lastState = mouseIsPressed
	  
	  if (shape == 1){
		  drawCube(g)
	  }
	  if(shape == 2){
		  drawCone(g)
	  }
	  if (shape == 3) {
		  g.image(img, 10, 5)
	  }

	var j = swerveCanvas.canvas;
	j.translate(w / 2, h / 2);
	j.rotate(totRotation);
	j.translate(-w / 2, -h / 2);
	  swerve(j);


	formManager.renderForms();
	formCursor.render();
}

function keyPressed() {
	formManager.keyPressed();

	// Testing
	if (keyCode == LEFT_ARROW) {
		totRotation += 0.1;
	} else if (keyCode == RIGHT_ARROW) {
		totRotation -= 0.1;
	}
	if (keyCode == UP_ARROW) {
		for (let i = 0; i < 4; i += 1) {
			wheels[i][0] += 1;
			// wheels[i][1] += 1;
		}
	} else if (keyCode == DOWN_ARROW) {
		for (let i = 0; i < 4; i += 1) {
			wheels[i][0] -= 1;
			// wheels[i][1] -= 1;
		}
	}
	if (keyCode == "SPACE") {
		// Anything else stops rotation
		// for (let i = 0; i < 4; i += 1) {
		// 	wheels[i][0] = 0;
		// 	// wheels[i][1] -= 1;
		// }
		// totRotation = 0;
		return 0;
	}
}

function keyReleased() {
	formManager.keyReleased();
}

function windowResized() {
	createCanvas(document.body.clientWidth, 945);
}

function drawCube(object){
	object.fill(160,0,255)
	object.strokeWeight(0)
	object.rect(90,80,70,70,5)
}

function drawCone(object){
	object.fill(255,255,0)
	object.stroke(255,255,0)
	object.strokeWeight(8)
	object.strokeJoin(ROUND);
	object.triangle(20,150,160,150,90,10)
}

// swerve
function swerve(object) {

	// swerve diagram
	n = 400 / 4;
	// Arrows
	let v1 = createVector(n, n);
	let v2 = createVector(n, 400 - n);
	let v3 = createVector(400 - n, 400 - n);
	let v4 = createVector(400 - n, n);
	arrows = [v1, v2, v3, v4];
		// Swerve Display Thing

	object.background(255);

	//Box
	object.strokeWeight(5);
  
	object.push();
	// Drawing frame and wheels, and rotating

	object.quad(n, n, n, h - n, w - n, h - n, w - n, n);
	a = [n, n];
	object.circle(n, n, n / 5);
	object.circle(w - n, n, n / 5);
	object.circle(n, h - n, n / 5);
	object.circle(w - n, h - n, n / 5);
	object.pop();
  
	for (let i = 0; i < 4; i++) {
		object.push();
		object.stroke(205, 0, 0);
		object.strokeWeight(w / 80);
		// Drawing and rotating vectors depending on totrotation
		object.translate(w / 2, h / 2);
		object.rotate(totRotation);
		object.translate(-w / 2, -h / 2);
	
		// Drawing and rotating vectors depending on independant wheel rotation
		object.translate(arrows[i].x, arrows[i].y);
		object.rotate(wheels[i][0]);
		object.translate(-arrows[i].x, -arrows[i].y);
		object.triangle(
			arrows[i].x + wheels[i][1]+5,
			arrows[i].y + wheels[i][1]-5,
			arrows[i].x + wheels[i][1] - 5,
			arrows[i].y + wheels[i][1] + 5,
			arrows[i].x + wheels[i][1]+8,
			arrows[i].y + wheels[i][1]+8,
		);
		object.line(
			arrows[i].x,
			arrows[i].y,
			arrows[i].x + wheels[i][1],
			arrows[i].y + wheels[i][1]
		);
		object.pop();
	}
}

function UI(object) {
	object.fill("black")
	for (i = 200*0.8; i < 800*0.8; i+=200*0.8) {
	  object.line(i, 0, i, 100*0.8)
	}
	object.line(0, 100*0.8,  800*0.8, 100*0.8)
	object.textSize(30*0.8);
	object.text("MODE", 65*0.8, 30*0.8)
	object.noFill()
	object.rect(10*0.8, 40*0.8, 180*0.8, 50*0.8)
	object.line(100*0.8, 40*0.8, 100*0.8, 90*0.8)
	
	object.fill(144, 238, 144)
	if (mode == "auto") {
		object.rect(10*0.8, 40*0.8, 90*0.8, 50*0.8)
	}
	
	else {
		object.rect(100*0.8, 40*0.8, 90*0.8, 50*0.8)
	}
	
	object.fill("black")
	object.text("Auto", 22*0.8, 75*0.8)
	object.textSize(21*0.8)
	object.text("Tele-OP", 105*0.8, 72*0.8)
	
	object.textSize(33*0.8)
	object.text("SCORE", 255*0.8, 30*0.8)
	
	object.textSize(35*0.8)
	//change line to this for links to be counted towards score
	object.text((score+links*5).toString(), 290*0.8, 75*0.8)
	
	object.textSize(30*0.8)
	object.text("Docked?", 410*0.8, 35*0.8)
	object.text("Engaged?", 410*0.8, 75*0.8)
	
	object.noFill()
	if (mode == 'tele' && docked[1]) {
        object.fill("green")
    }
    else if (mode == 'auto' && docked[0]) {
        object.fill("green")
    }
    object.rect(555*0.8, 15*0.8, 20*0.8, 20*0.8)
    object.noFill()
    
    if (mode == 'tele' && engaged[1]) {
        object.fill("green")
    }
    else if (mode == 'auto' && engaged[0]) {
        object.fill("green")
    }
	object.rect(555*0.8, 55*0.8, 20*0.8, 20*0.8)
	
	object.fill("black")
	
	object.textSize(30*0.8)
	object.text("LINKS", 655*0.8, 30*0.8)
	
	object.textSize(35*0.8)
	object.text(links.toString(), 690*0.8,75*0.8)
	object.fill("white")
  }

  function mouseClicked() {
    for (i = 0; i < 3; i+=1) {
      for (j = 0; j < 9; j+=1) {
        if (onHitbox((j*80+50)*0.8, (i*100+120)*0.8, 60*0.8, 60*0.8)) {
          if (grid[i][j] == 0) {
            grid[i][j] = 1;
            //if not scored before
            if (modeScored[i][j] == 0) {
                if (mode=="auto") {
                    modeScored[i][j] = "auto"
                }
                else {
                    modeScored[i][j] = "tele"
                }
            }
            calculateScore("piece", i, j, 1)
            computeLinks()
          }
          else {
            grid[i][j] = 0;
            //if not scored before
            if (modeScored[i][j] == 0) {
                if (mode=="auto") {
                    modeScored[i][j] = "auto"
                }
                else {
                    modeScored[i][j] = "tele"
                }
            }
            calculateScore("piece", i, j, -1)
            computeLinks()
          }
        }
      }
    }
    if (onHitbox(10*0.8, 40*0.8, 90*0.8, 50*0.8)) {
      mode = "auto"
      computeLinks()
    }
    if (onHitbox(100*0.8, 40*0.8, 90*0.8, 50*0.8)) {
      mode = "tele"
      computeLinks()
    }

    if (onHitbox(555*0.8, 15*0.8, 20*0.8, 20*0.8)) {
        if (mode == 'auto'){
            if (!docked[0]) {
                docked[0] = true;
                calculateScore("dock", -1, -1, 1)
            }
            else {
                docked[0] = false;
                calculateScore("dock", -1, -1, -1)
            }
        }
        else if (mode == 'tele'){
            if (!docked[1]) {
                docked[1] = true;
                calculateScore("dock", -1, -1, 1)
            }
            else {
                docked[1] = false;
                calculateScore("dock", -1, -1, -1)
            }
        }
    }
    if (onHitbox(555*0.8, 55*0.8, 20*0.8, 20*0.8)) {
        if (mode == 'auto'){
            if (!engaged[0]) {
                engaged[0] = true;
                calculateScore("dock", -1, -1, 1)
            }
            else {
                engaged[0] = false;
                calculateScore("dock", -1, -1, -1)
            }
        }
        else if (mode == 'tele'){
            if (!engaged[1]) {
                engaged[1] = true;
                calculateScore("dock", -1, -1, 1)
            }
            else {
                engaged[1] = false;
                calculateScore("dock", -1, -1, -1)
            }
        }
    }
  }
  
  function onHitbox(x, y, w, h) {
	return (scoreForm.mouseX-12 > x && scoreForm.mouseX-12 < x+w && scoreForm.mouseY-(30*0.8) > y && scoreForm.mouseY-(30*0.8) < y+h);
  }

  function onHitboxV2(x, y, w, h) {
	return (LEDform.mouseX-8 > x && LEDform.mouseX-8 < x+w && LEDform.mouseY-(30*0.8) > y && LEDform.mouseY-(30*0.8) < y+h);
  }
  
  //dock, eng, piece
  function calculateScore(type, y, x, operation) {
	if (type == "piece") {
		if (modeScored[y][x] == "auto") {
			if (y == 2) {
				score += 3*operation
			}
			else if (y == 1) {
				score += 4*operation
			}
			else {
				score += 6*operation
			}
		}
		else {
			if (y == 2) {
				score += 2*operation
			}
			else if (y == 1) {
				score += 3*operation
			}
			else {
				score += 5*operation
			} 
		}
	}
	else if (mode == "auto") {
	  if (type == "dock") {
		score += 8*operation
	  }
	  else {
		score += 4*operation
	  }
	}
	else {
	  if (type == "dock") {
		score += 6*operation
	  }
	  else {
		score += 4*operation
	  }
	}
	computeLinks()
  }
  
  function computeLinks() {
	temp = 0
	for (i = 0; i < 3; i+=1) {
	  for (j = 0; j <= 6; j+=1) {
		if (grid[i][j] && grid[i][j+1] && grid[i][j+2]) {
			temp+=1
			j+=2
		}
	  }
	}
	links = temp*1
  }

window.onresize = windowResized();