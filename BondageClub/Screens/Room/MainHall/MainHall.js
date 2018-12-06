var MainHallBackground = "MainHall";
var MainHallNextEventTimer = null;
var MainHallMaid = null;
var MainHallIsMaid = false;
var MainHallIsHeadMaid = false;

// Main hall loading
function MainHallLoad() {
	MainHallNextEventTimer = null;
	MainHallMaid = CharacterLoadNPC("NPC_MainHall_Maid");
	MainHallIsMaid = LogQuery("JoinedSorority", "Maid");
	MainHallIsHeadMaid = LogQuery("LeadSorority", "Maid");
}

// Run the main hall screen
function MainHallRun() {

	// Make the user wait if there's something in the account queue
	if (AccountQueueIsEmpty()) {

		// Draws the character and main hall buttons
		DrawCharacter(Player, 750, 0, 1);
		DrawButton(1525, 25, 90, 90, "", "White", "Icons/Character.png");
		DrawButton(1645, 25, 90, 90, "", "White", "Icons/Dress.png");
		if (Player.CanWalk()) DrawButton(1765, 25, 90, 90, "", "White", "Icons/Shop.png");
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		if (Player.CanWalk()) DrawButton(1525, 145, 450, 65, TextGet("IntroductionClass"), "White");
		if (Player.CanWalk()) DrawButton(1525, 240, 450, 65, TextGet("MaidQuarters"), "White");
		if (Player.CanWalk()) DrawButton(1525, 335, 450, 65, TextGet("ShibariDojo"), "White");
		
		// Check if there's a new maid rescue event to trigger
		if ((!Player.CanInteract() || !Player.CanWalk() || !Player.CanTalk()) && (MainHallNextEventTimer == null)) MainHallNextEventTimer = ReputationTimer("Dominant", true);
		if ((MainHallNextEventTimer != null) && (new Date().getTime() > MainHallNextEventTimer)) {
			MainHallNextEventTimer = null;
			if (!Player.CanInteract() || !Player.CanWalk() || !Player.CanTalk()) {
				MainHallMaid.Stage = "0";
				CharacterSetCurrent(MainHallMaid);
			}
		}

	} else DrawText(TextGet("SyncWithServer"), 1000, 500, "White", "Black");

}

// When the user clicks in the main hall screen
function MainHallClick() {

	// We only allow clicks if the account queue is empty
	if (AccountQueueIsEmpty()) {
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 1525) && (MouseX < 1615) && (MouseY >= 25) && (MouseY < 115)) InformationSheetLoadCharacter(Player);
		if ((MouseX >= 1645) && (MouseX < 1735) && (MouseY >= 25) && (MouseY < 115)) CommonSetScreen("Character", "Appearance");
		if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "Shop");		  
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) CommonSetScreen("Character", "Login");
		if ((MouseX >= 1575) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 210) && Player.CanWalk()) CommonSetScreen("Room", "Introduction");
		if ((MouseX >= 1575) && (MouseX < 1975) && (MouseY >= 240) && (MouseY < 305) && Player.CanWalk()) CommonSetScreen("Room", "MaidQuarters");
		if ((MouseX >= 1575) && (MouseX < 1975) && (MouseY >= 335) && (MouseY < 400) && Player.CanWalk()) CommonSetScreen("Room", "Shibari");
	}

}

// The maid can release the player
function MainHallMaidReleasePlayer() {
	if (MainHallMaid.CanInteract()) {
		for(var D = 0; D < MainHallMaid.Dialog.length; D++)
			if ((MainHallMaid.Dialog[D].Stage == "0") && (MainHallMaid.Dialog[D].Option == null))
				MainHallMaid.Dialog[D].Result = DialogFind(MainHallMaid, "AlreadyReleased");
		CharacterRelease(Player);
		MainHallMaid.Stage = "10";
	} else MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "CannotRelease");
}

// If the maid is angry, she might gag or tie up the player
function MainHallMaidAngry() {
	if ((ReputationGet("Dominant") < 30) && !MainHallIsHeadMaid) {
		for(var D = 0; D < MainHallMaid.Dialog.length; D++)
			if ((MainHallMaid.Dialog[D].Stage == "PlayerGagged") && (MainHallMaid.Dialog[D].Option == null))
				MainHallMaid.Dialog[D].Result = DialogFind(MainHallMaid, "LearnedLesson");
		ReputationProgress("Dominant", 1);
		InventoryWearRandom(Player, "ItemMouth");
		if (Player.CanInteract()) {
			InventoryWear(Player, "LeatherArmbinder", "ItemArms");
			MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "TeachLesson");
		}		
	} else MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "Cower");
}