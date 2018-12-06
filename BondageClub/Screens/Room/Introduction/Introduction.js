var IntroductionBackground = "Introduction";
var IntroductionMaid = null;
var IntroductionSub = null;
var IntroductionMaidOpinion = 0;
var IntroductionHasBasicItems = false;
var IntroductionSubRestrained = false;
var IntroductionIsMaid = false;
var IntroductionIsHeadMaid = false;

// Loads the introduction room
function IntroductionLoad() {

	// Checks if the player already has the basic items
	IntroductionHasBasicItems = (InventoryAvailable(Player, "NylonRope", "ItemFeet") && InventoryAvailable(Player, "NylonRope", "ItemLegs") && InventoryAvailable(Player, "NylonRope", "ItemArms") && InventoryAvailable(Player, "SmallClothGag", "ItemMouth"));
	IntroductionIsMaid = LogQuery("JoinedSorority", "Maid");
	IntroductionIsHeadMaid = LogQuery("LeadSorority", "Maid");
	
	// Creates two characters to begin with
	IntroductionMaid = CharacterLoadNPC("NPC_Introduction_Maid");
	IntroductionSub = CharacterLoadNPC("NPC_Introduction_Sub");

}

// Run the main introduction room, draw all 3 characters
function IntroductionRun() {
	IntroductionSubRestrained = (!IntroductionSub.CanTalk() && !IntroductionSub.CanWalk() && !IntroductionSub.CanInteract());
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(IntroductionMaid, 750, 0, 1);
	DrawCharacter(IntroductionSub, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the introduction room
function IntroductionClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(IntroductionMaid);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(IntroductionSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// The maid opinion will affect the global player Domme/sub reputation at the end of the first training
function IntroductionChangeMaidOpinion(Bonus) {
	IntroductionMaidOpinion = IntroductionMaidOpinion + Bonus;
}

// Gives focus on certain body parts with rectangles
function IntroductionSetZone(NewZone) {
	for (var A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == NewZone) {
			Player.FocusGroup = AssetGroup[A];
			CurrentCharacter.FocusGroup = AssetGroup[A];
			break;
		}
}

// Clears the body part focus rectangles
function IntroductionClearZone() {
	Player.FocusGroup = null;
	CurrentCharacter.FocusGroup = null;
}

// The maid can give basic items to the player
function IntroductionGetBasicItems() {
	InventoryAdd(Player, "NylonRope", "ItemFeet");
	InventoryAdd(Player, "NylonRope", "ItemLegs");
	InventoryAdd(Player, "NylonRope", "ItemArms");
	InventoryAdd(Player, "SmallClothGag", "ItemMouth");
	IntroductionHasBasicItems = true;
}

// Saves the maid opinion of the player to the server
function IntroductionSaveMaidOpinion() {
	if (!LogQuery("MaidOpinion", "Introduction")) {
		LogAdd("MaidOpinion", "Introduction");
		ReputationChange("Dominant", IntroductionMaidOpinion);
	}
}

// Returns TRUE if the maid can restrain the player
function IntroductionAllowRestrainPlayer() {
	return (Player.CanInteract() && IntroductionMaid.CanInteract());
}

// Gags the player unless she's head maid
function IntroductionGagPlayer() {
	if (IntroductionIsHeadMaid) {
		CharacterRelease(Player);
		IntroductionMaid.CurrentDialog = DialogFind(IntroductionMaid, "ReleaseHeadMaid");
		IntroductionMaid.Stage = "370";
	} else DialogWearItem("SmallClothGag", "ItemMouth")
}