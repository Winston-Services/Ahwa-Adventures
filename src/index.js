import * as readline from "readline/promises";
import { Server } from "socket.io";
import { io } from "socket.io-client";
import {
  AhwaAdeventure,
  Armor,
  Character,
  GameMap,
  Monster,
  Treasure,
  Weapon
} from "./classes/index.js";
import { setTimeout as wait } from "node:timers/promises";
import {
  ChainMailArmor,
  Characters,
  LeatherArmor,
  NoArmor,
  PlateArmor,
  Weapons
} from "./components/index.js";

const rl = readline.createInterface(process.stdin, process.stdout);
const say = (m) => console.log(m);
const clear = () => {}; //console.clear();
const ask = (q) => rl.question(q);

function intro() {
  say(
    "Welcome\n\t\tto\nAhwa Adventures.\nThis is a role playing game based on The Wizards Castle."
  );
}

async function instructions() {
  const answer = await ask(
    "Would you like to see the instructions?\nEnter [(Y)es | (N)o]"
  );
  if (
    !answer.toLowerCase().startsWith("y") &&
    !answer.toLowerCase().startsWith("n")
  ) {
    say(
      "If you can't follow simple instructions how will you survive the castle. Try again."
    );
    return instructions();
  } else {
    if (answer.toLowerCase().startsWith("y")) {
      say("\t1) Don't Die!\n\t2) See Rule One.");
    }
  }
}

async function selectMapType() {
  const answer = await ask(
    "Would you like the standard map or a random map? Enter [(S)tandard | (R)andom]"
  );
  if (
    !answer.toLowerCase().startsWith("s") &&
    !answer.toLowerCase().startsWith("r")
  ) {
    say("Are you thick? There are two choices! Pick one.");
    return selectMapType();
  }
  if (answer.toLowerCase().startsWith("s")) {
    say("Generating the Standard Map.");
    return "Standard";
  } else {
    say("Generating a Random Map.");
    return "Random";
  }
}

async function generateMap(mapType, l = 15, r = 30, c = 50, standard = 8) {
  const map = new GameMap({ type: mapType });
  switch (mapType) {
    case "Random":
      map.Map(
        AhwaAdeventure.random(l, standard),
        AhwaAdeventure.random(r, standard),
        AhwaAdeventure.random(c, standard)
      );
      break;
    case "Custom":
      map.Map(
        AhwaAdeventure.random(l, standard),
        AhwaAdeventure.random(r, standard),
        AhwaAdeventure.random(c, standard)
      );
      break;
    default:
      map.Map(8, 8, 8);
      break;
  }
  return map;
}

async function selectGender(characterType, gameMap) {
  const gender = await ask(
    `Ok, what gender are you ${characterType}? Enter [(M)ale | (F)emale | (O)ther]`
  );
  switch (gender.toLowerCase()) {
    case "m" || "male":
      return Characters.male[characterType];
    case "f" || "female":
      return Characters.female[characterType];
    case "o" || "other":
      return Characters.other[characterType];
    default:
      say("I can see you are gonna have problems. Maybe this isn't your game?");
      return selectGender(characterType, gameMap);
  }
}

async function createCharacter(gameMap) {
  say("Select a character.");
  say("");
  const characterType = await ask(
    new Character({ type: "player" })._races
      .map((race) => `${race}`)
      .join("\n") + "\nChoose one : "
  );
  if (new Character({ type: "player" })._races.indexOf(characterType) === -1) {
    say(
      "Ok, if you dont want to play, just press ctrl-c, dont be {RANDOM_MONSTER}."
    );
    return createCharacter(gameMap);
  }
  clear();
  return selectGender(characterType, gameMap);
}

async function setExtraPointsAmount(adventure, attribute) {
  clear();
  const points = await ask(
    `How many of your ${adventure.player.extraPoints} extra points would you like to assign to ${attribute}? `
  );
  if (isNaN(points) || Number(points) > adventure.player.extraPoints) {
    say(
      `You need to enter a number between 1 and ${adventure.player.extraPoints}. Try again?`
    );
    await wait(1000);
    return setExtraPointsAmount(adventure, attribute);
  }
  if (Number(points) === adventure.player.extraPoints) {
    say(
      `You have used all ${adventure.player.extraPoints} extra points left on ${attribute}.`
    );
    // console.log(adventure.player);
    adventure.player.inc[attribute.toLowerCase()](Number(points));
    adventure.player.extraPoints -= Number(points);
    // console.log(adventure.player);
    return adventure;
  } else {
    say(
      `${
        adventure.player.race
      }, you have assigned ${points} to ${attribute} and have ${
        adventure.player.extraPoints - points
      } points left to assign.`
    );
    await wait(3000);
    // console.log(adventure.player);
    adventure.player.inc[attribute.toLowerCase()](Number(points));
    adventure.player.extraPoints -= Number(points);
    // console.log(adventure.player);
    return assignExtraPoints(adventure);
  }
}

async function assignExtraPoints(adventure) {
  clear();
  say(
    `${adventure.player.race} you have ${adventure.player.extraPoints} extra points to assign to attributes.`
  );
  const attribute = await ask(
    "What attribute would you like to assign your extra points? Enter [(S)tength | (I)ntelligence | (D)exterity]"
  );
  if (
    ["s", "i", "d", "strenth", "intelligence", "dexterity"].indexOf(
      attribute.toLowerCase()
    ) === -1
  ) {
    say(
      "How about select one of the options? Try it again, this time get it right!"
    );
    await wait(5000);
    return assignExtraPoints(adventure);
  }
  switch (attribute.toLowerCase()) {
    case "s":
    case "strength":
      return setExtraPointsAmount(adventure, "Strength");
    case "d":
    case "dexterity":
      return setExtraPointsAmount(adventure, "Dexterity");
    case "i":
    case "intelligence":
      return setExtraPointsAmount(adventure, "Intelligence");
  }
}

async function chooseArmor(adventure) {
  clear();
  const answer = await ask(
    "Armor : \n" +
      new Armor({})._types
        .map(
          (type) =>
            `${type.name.replace(" ", "")} ${
              adventure.player.gold > 999 ? type.max : type.min
            }`
        )
        .join("\n") +
      "\nChoose One : "
  );
  if (
    ["none", "plate", "chainmail", "leather"].indexOf(
      answer.replace(" ", "").toLowerCase()
    ) === -1
  ) {
    say("Maybe you did not understand. Here try reading it again.");
    await wait(2000);
    return chooseArmor(adventure);
  }
  let type = { name: "None", max: 0, min: 0 };
  switch (answer.replace(" ", "").toLowerCase()) {
    case "plate":
      adventure.player.armor = PlateArmor;
      type = new Armor({})._types.filter(
        (type) => type.name.replace(" ", "") === "Plate"
      );
      // console.log("Chose : " , type);
      adventure.player.gold -=
        adventure.player.gold > 999 ? type[0].max : type[0].min;
      break;

    case "chainmail":
      adventure.player.armor = ChainMailArmor;
      type = new Armor({})._types.filter(
        (type) => type.name.replace(" ", "") === "ChainMail"
      );
      adventure.player.gold -=
        adventure.player.gold > 999 ? type[0].max : type[0].min;
      break;

    case "leather":
      adventure.player.armor = LeatherArmor;
      type = new Armor({})._types.filter(
        (type) => type.name.replace(" ", "") === "Leather"
      );
      adventure.player.gold -=
        adventure.player.gold > 999 ? type[0].max : type[0].min;
      break;
    case "none":
    default:
      adventure.player.armor = NoArmor;
      break;
  }
  return adventure;
}

async function selectArmor(adventure) {
  clear();
  if (adventure.player.gold > 0) {
    const answer = await ask(
      `You have ${adventure.player.gold} gold to buy armor.\nWould you like to buy some armor?\nEnter [(Y)es | (N)o] : `
    );
    if (["y", "yes", "n", "no"].indexOf(answer.toLowerCase()) === -1) {
      say("It was a simple question, could you answer it this time?");
      return selectArmor(adventure);
    }
    if (["y", "yes"].indexOf(answer.toLowerCase()) !== -1) {
      return chooseArmor(adventure);
    } else {
      adventure.player.armor = NoArmor;
      return adventure;
    }
  }
}

async function chooseWeapon(adventure) {
  if (adventure.player.gold > 0) {
    clear();
    const weapon = await ask(
      "Weapons : \n" +
        new Weapon({})._types
          .map((type) => {
            return `\t${type.name}\t\t${
              adventure.player.gold > 999 ? type.max : type.min
            } `;
          })
          .join("\n") +
        "\nChoose a Weapon : "
    );
    if (new Weapon({})._types.map((type) => type.name).indexOf(weapon) === -1) {
      say("That was not a choice. Try again, but chose something available.");
      await wait(2000);
      return chooseWeapon(adventure);
    }
    say(`You chose a ${weapon}.`);
    let type = { name: "None", max: 0, min: 0 };
    switch (weapon) {
      case "Mace":
        type = new Weapon({})._types.filter(
          (type) => type.name.replace(" ", "") === "Mace"
        );
        adventure.player.weapon = Weapons[weapon];
        adventure.player.gold -=
          adventure.player.gold > 999 ? type[0].max : type[0].min;
        break;
      case "Dagger":
        type = new Weapon({})._types.filter(
          (type) => type.name.replace(" ", "") === "Dagger"
        );
        adventure.player.weapon = Weapons[weapon];
        adventure.player.gold -=
          adventure.player.gold > 999 ? type[0].max : type[0].min;
        break;
      case "Sword":
        type = new Weapon({})._types.filter(
          (type) => type.name.replace(" ", "") === "Sword"
        );
        adventure.player.weapon = Weapons[weapon];
        adventure.player.gold -=
          adventure.player.gold > 999 ? type[0].max : type[0].min;
        break;
      case "None":
      default:
        adventure.player.weapon = Weapons.NoWeapon;
        break;
    }
    return adventure;
  } else {
    adventure.player.weapon = Weapons.NoWeapon;
    return adventure;
  }
}

async function selectWeapon(adventure) {
  clear();
  const answer = await ask(
    `You have ${adventure.player.gold} gold to buy a weapon. Would you like to buy a weapon? Enter [(Y)es | (N)o]`
  );
  if (["y", "yes", "n", "no"].indexOf(answer.toLowerCase()) === -1) {
    say("It was a simple question, could you answer it this time?");
    return selectWeapon(adventure);
  }
  if (["y", "yes"].indexOf(answer.toLowerCase()) !== -1) {
    return chooseWeapon(adventure);
  } else {
    adventure.player.weapon = Weapons.NoWeapon;
    return adventure;
  }
}

async function connectToNetworkGame(adventure) {
  const socket = new io(
    `ws://${adventure.network.host}:{adventure.network.port}`
  );
  socket.on("vender_action", (action) => {
    if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
      return;
    if (action.hasOwnProperty("type") !== "vender_action") return;
  });
  socket.on("monster_attack", (action) => {
    if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
      return;
    if (action.hasOwnProperty("type") !== "monster_attack") return;
  });
  socket.on("player_enters", (action) => {
    if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
      return;
    if (action.hasOwnProperty("type") !== "player_enters") return;
  });
  socket.on("player_turn", (action) => {
    if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
      return;
    if (action.hasOwnProperty("type") !== "player_turn") return;
  });
  socket.on("player_attack", (action) => {
    if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
      return;
    if (action.hasOwnProperty("type") !== "player_attack") return;
  });
  socket.on("player_dies", (action) => {
    if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
      return;
    if (action.hasOwnProperty("type") !== "player_dies") return;
  });
  socket.on("player_leaves", (action) => {
    if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
      return;
    if (action.hasOwnProperty("type") !== "player_leaves") return;
  });
  socket.on("player_wins", (action) => {
    if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
      return;
    if (action.hasOwnProperty("type") !== "player_wins") return;
  });
}

async function getHostIp(adventure) {
  const ip = await ask(
    "What is the ip address of the host machine? Enter [localhost | 127.0.0.1]"
  );
  if (ip === "localhost") {
    adventure.network = {
      host: "localhost"
    };
  } else {
    //validate ip
    adventure.network = {
      host: ip
    };
  }
}

async function getHostPort(adventure) {
  const port = await ask(
    "What is the port for the host machine? Enter [6969 | nnnnn]"
  );
  if (port === "6969") {
    adventure.network.port = 6969;
  } else {
    //validate port
    adventure.network.port = port;
  }
}

async function initializeHost(adventure) {
  // add socket.io server
  const io = new Server(adventure.network);
  io.on("connect", (socket) => {
    socket.on("vender_action", (action) => {
      if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
        return;
      if (action.hasOwnProperty("type") !== "vender_action") return;
    });
    socket.on("monster_attack", (action) => {
      if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
        return;
      if (action.hasOwnProperty("type") !== "monster_attack") return;
    });
    socket.on("player_enters", (action) => {
      if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
        return;
      if (action.hasOwnProperty("type") !== "player_enters") return;
    });
    socket.on("player_turn", (action) => {
      if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
        return;
      if (action.hasOwnProperty("type") !== "player_turn") return;
    });
    socket.on("player_attack", (action) => {
      if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
        return;
      if (action.hasOwnProperty("type") !== "player_attack") return;
    });
    socket.on("player_dies", (action) => {
      if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
        return;
      if (action.hasOwnProperty("type") !== "player_dies") return;
    });
    socket.on("player_leaves", (action) => {
      if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
        return;
      if (action.hasOwnProperty("type") !== "player_leaves") return;
    });
    socket.on("player_wins", (action) => {
      if (!action.hasOwnProperty("type") || !action.hasOwnProperty("payload"))
        return;
      if (action.hasOwnProperty("type") !== "player_wins") return;
    });
  });
}

async function hostNetworkGame(adventure) {
  await getHostIp(adventure);
  await getHostPort(adventure);
  await initializeHost(adventure);
  await connectToNetworkGame(adventure);
}

async function hostOrConnect(adventure) {
  const isHost = await ask(
    "Are you hosting this game or connecting to another game? Enter [(H)osting | (C)onnecting]"
  );
  if (["h", "host", "c", "connecting"].indexOf(isHost) === -1) {
    say("No, Dummy! Pick one of the choices, can't you cant a spell!");
    await wait(2000);
  }
  switch (isHost.toLowerCase()) {
    case "h":
    case "host":
      say("Let's setup your host.");
      return hostNetworkGame(adventure);
    case "c":
    case "connecting":
      return connectToNetworkGame(adventure);
  }
}

async function setGamePlayLocation(adventure) {
  const answer = await ask(
    "Would you like to play a local game or a network game? Enter [(L)ocal | (N)etwork] "
  );
  if (["l", "local", "n", "network"].indexOf(answer.toLowerCase()) === -1) {
    say(
      "Can you choose one of the provided options. It will get us a lot further."
    );
    await wait(2000);
    return setGamePlayLocation(adventure);
  }
  if (answer.toLowerCase().startsWith("l")) {
    say("Starting Local Game.");
    adventure.isLocal = true;
  } else {
    adventure.isLocal = false;
    return hostOrConnect(adventure);
  }
}

async function buyLampAndOil(adventure) {
  if (adventure.player.gold > 19) {
    say(
      "Ok, {0}, you have {1} gold to buy items."
        .replace("{0}", adventure.player.race)
        .replace("{1}", adventure.player.gold)
    );
    let lampCost = 20;
    if (adventure.player.gold > 999) {
      lampCost = 1000;
    }
    const choice = await ask(
      `Do you want to buy a lamp and oil?\nIt will cost ${lampCost} gold.\nChoose yes to buy or no to skip it.\nEnter [(Y)es | (N)o]`
    );
    if (choice[0].toLowerCase() === "y") {
      say("You bought a lamp with oil.");
      adventure.player.lamp = true;
      adventure.player.lampBurn = 10;
      adventure.player.gold -= lampCost;
      return buyLampAndOil(adventure);
    }
    return adventure;
  }
}

async function buyFlares(adventure) {
  if (adventure.player.gold > 0) {
    say(
      "Ok, {0}, you have {1} gold to buy items."
        .replace("{0}", adventure.player.race)
        .replace("{1}", adventure.player.gold)
    );
    const flares = await ask(
      `How many flares do you want to buy?\n\tEach flare is 1 gold.\nEnter [0-${adventure.player.gold}] `
    );
    if (Number(flares) > adventure.player.gold) {
      say(
        `NO! ${adventure.player.race}, You dont have that much. Can't you count.`
      );
      await wait(1500);
      return buyFlares(adventure);
    }
    if (Number(flares) === 0) {
      return adventure;
    }
    adventure.player.gold -= Number(flares);
    adventure.player.flares += Number(flares);
    return buyFlares(adventure);
  }
}

async function initializeKnownMap(adventure) {
  // console.log(adventure.gameMap);
  adventure.player.known = adventure.gameMap;
}

async function showKnownMap(adventure) {
  let str = adventure.gameMap.Show(adventure.player);
  say(str);
}

async function setRunestaff(adventure) {
  adventure.game = new AhwaAdeventure(adventure.gameMap.type);
  adventure.game.map = adventure.gameMap;
  // console.log("Adventure\n", adventure.game.Find);
  const [level, row, column, monster] = adventure.game.Find.Monster();
  // console.log("Runestaff", level, row, column, monster);
  adventure.game.runestaffLocation = [level, row, column];
}

async function start(adventure) {
  adventure.running = true;
  adventure.game.addPlayer(adventure.player);
  say(adventure.game.enterGame(adventure.player));
}

async function playerDeath(adventure) {
  adventure.game.PlayerDeath(adventure.player);
  say("****** You DIED! ******");
  say("When you died, you had:");
  adventure.game.running = false;
}

function setVisableMap(adventure, level, row, column) {
  adventure.player.known.levels[level].rows[row].columns[column].value =
    adventure.game.levels[level].rows[row].columns[column].value;

  if (
    adventure.player.known.levels[level].rows[row].columns[column].value === "X"
  ) {
    adventure.player.known.levels[level].rows[row].columns[column].value = "-";
  }
  if (
    adventure.player.known.levels[level].rows[row].columns[column].value === "Z"
  ) {
    adventure.player.known.levels[level].rows[row].columns[column].value = "W";
  }
}

function isCursed(adventure) {
  if (adventure.player.blind) {
    say(`You are blind.`);
  }
  if (adventure.player.forgetfulness) {
    say(
      `{You} are cursed with forgetfulness.`.replace(
        "{You}",
        "You " + adventure.player.race
      )
    );
  }
  if (adventure.player.leech) {
    say(`You have a leech affliction.`);
  }
  if (adventure.player.lethargy) {
    say(`You are cursed with Lethargy.`);
  }
}

function sayCurrentPlayerLocation(adventure) {
  say(
    `You are at (${adventure.player.location[1] + 1},${
      adventure.player.location[2] + 1
    }) Level ${adventure.player.location[0] + 1}`
  );
}

function sayCurrentPlayerStats(adventure) {
  say(
    `Dexterity = ${adventure.player.dexterity}  Intelligence = ${adventure.player.intelligence}  Strength = ${adventure.player.strength}`
  );
}

function showMenu() {
  say("You can do the following actions.");
  say("Options:");
  say("(M)ap\tView the Map.");
  say("(G)aze\tGaze in to a Crystal Ball.");
  say("(O)pen\tOpen a Treasure Chest.");
  say("(P)ool\tDrink from the pool.");
  say("(F)lare\tLight a flare.");
  say("(L)amp\tShine your lamp.");
  say("(E)ast\tMove East.");
  say("(N)orth\tMove North.");
  say("(S)outh\tMove South.");
  say("(W)est\tMove West.");
  say("(U)p\tGo up stairs.");
  say("(D)own\tGo down stairs.");
  say("(T)eleport\tTeleport to another location on the map.");
  say("(A)ttack\tAttack a monster or vendor.");
  say("(R)etreat\tRetreat from battle.");
  say("(B)ribe\tBribe a vendor.");
  say("(Q)uit\tQuit the game.");
}

async function showMap(adventure) {
  if (adventure.player.blind) {
    return Promise.resolve(
      say(
        "Blind {RACE} you can't see your map.".replace(
          "{RACE}",
          adventure.player.race
        )
      )
    );
  } else await showKnownMap(adventure);
}

async function gazeInToOrb(adventure) {
  if (
    adventure.game.map.levels[adventure.player.location[0]].rows[
      adventure.player.location[1]
    ].columns[adventure.player.location[2]].value === "O" &&
    !adventure.player.blind
  ) {
    // OrbGaze(adventure); // Invoke Orb
    let gaze = "bloody heap";
    say("You gaze into the orb and see {CONTENT}".replace("{CONTENT}", gaze));
    if (gaze === "bloody heap") {
      let strengthLoss = AhwaAdeventure.random(3);
      say(
        "Seeing {0} causes you to loose {1} strength points!"
          .replace("{0}", gaze)
          .replace("{1}", strengthLoss)
      );
      adventure.player.dec.strength(strengthLoss);
    }
  } else if (!adventure.player.blind) {
    say(
      "{RACE} there's no orb to Gaze upon.".replace(
        "{RACE}",
        adventure.player.race
      )
    );
  } else {
    say(
      "Blind {RACE} you can't see the nose on your face let alone Gaze into anything.".replace(
        "{RACE}",
        adventure.player.race
      )
    );
  }
}

async function openABook(adventure) {
  if (
    adventure.game.map.levels[adventure.player.location[0]].rows[
      adventure.player.location[1]
    ].columns[adventure.player.location[2]].value === "B"
  ) {
    if (adventure.player.blind) {
      say(
        "You're blind, your not able to see your hands in front of your face. Let alone read a book that's not done in brail."
      );
    } else {
      say(
        "You open the book and {0}".replace(
          "{0}",
          adventure.game.ReadBook(adventure.game, adventure.player)
        )
      );
      adventure.game.map.levels[adventure.player.location[0]].rows[
        adventure.player.location[1]
      ].columns[adventure.player.location[2]].value = "X";
      adventure.player.known.levels[adventure.player.location[0]].rows[
        adventure.player.location[1]
      ].columns[adventure.player.location[2]].value = "-";
    }
  } else if (
    adventure.game.map.levels[adventure.player.location[0]].rows[
      adventure.player.location[1]
    ].columns[adventure.player.location[2]].value === "C"
  ) {
    adventure.game.map.levels[adventure.player.location[0]].rows[
      adventure.player.location[1]
    ].columns[adventure.player.location[2]].value = "X";
    adventure.player.known.levels[adventure.player.location[0]].rows[
      adventure.player.location[1]
    ].columns[adventure.player.location[2]].value = "-";
    say("You open a chest and found a {0}".replace("{0}", "Treasure Chest"));
  } else {
    say(
      "{RACE} the only thing you opened was your mind.".replace(
        "{RACE}",
        adventure.player.race
      )
    );
  }
}

async function drinkFromPool(adventure) {
  if (
    adventure.game.map.levels[adventure.player.location[0]].rows[
      adventure.player.location[1]
    ].columns[adventure.player.location[2]].value === "P"
  ) {
    say("You drink from the pool and {0}");
  } else {
    say("If your thirsty find a pool.");
  }
}

async function lightAFlair(adventure) {
  if (adventure.player.blind) {
    say(
      "you're BLIND {0} and you don't want to burn your fingers.".replace(
        "{0}",
        adventure.player.race
      )
    );
  } else {
    if (adventure.player.flares < 0) {
      adventure.player.flares -= 1;
      const [level, row, column] = adventure.player.location;
      let rowMinus = row - 1;
      if (rowMinus < 0) {
        rowMinus = adventure.game.levels[level].rows.length - 1;
      }
      let rowPlus = row + 1;
      if (rowPlus > adventure.game.levels[level].rows.length - 1) {
        rowPlus = 0;
      }
      let columnMinus = column - 1;
      if (columnMinus < 0) {
        columnMinus = adventure.game.levels[level].rows[row].columns.length - 1;
      }
      let columnPlus = column + 1;
      if (
        columnPlus >
        adventure.game.levels[level].rows[row].columns.length - 1
      ) {
        columnPlus = 0;
      }
      setVisableMap(adventure, level, rowMinus, columnMinus);
      setVisableMap(adventure, level, rowMinus, column);
      setVisableMap(adventure, level, rowMinus, columnPlus);
      setVisableMap(adventure, level, row, columnMinus);
      setVisableMap(adventure, level, row, columnPlus);
      setVisableMap(adventure, level, rowPlus, columnMinus);
      setVisableMap(adventure, level, rowPlus, column);
      setVisableMap(adventure, level, rowPlus, columnPlus);
      return showKnownMap(adventure);
    } else {
      const phrases = [
        "Hey bright one, you don't have any flares.",
        "You sing 'Come on baby light my fire' to yourself as you are out of flares.",
        "You can't use flares you don't have, but maybe your smile will brighten the room.",
        "You spend 5 minutes searching your rucksack before you realize you have no flares."
      ];
      say(AhwaAdeventure.randomize(phrases)[0]);
    }
  }
}

async function shineALamp(adventure) {
  if (adventure.player.blind) {
    say(
      "you're BLIND {0} and you can't see anything.".replace(
        "{0}",
        adventure.player.race
      )
    );
  } else {
    if (adventure.player.lamp && adventure.player.lampBurn > 0) {
      const [level, row, column] = adventure.player.location;
      let rowMinus = row - 1;
      if (rowMinus < 0) {
        rowMinus = adventure.game.levels[level].rows.length - 1;
      }
      let rowPlus = row + 1;
      if (rowPlus > adventure.game.levels[level].rows.length - 1) {
        rowPlus = 0;
      }
      let columnMinus = column - 1;
      if (columnMinus < 0) {
        columnMinus = adventure.game.levels[level].rows[row].columns.length - 1;
      }
      let columnPlus = column + 1;
      if (
        columnPlus >
        adventure.game.levels[level].rows[row].columns.length - 1
      ) {
        columnPlus = 0;
      }
      say("Shine the Lamp in which direction?");
      const answer = await ask(
        "Choose One : \n Enter [(N)orth, (S)outh, (E)ast, (W)est]\n "
      );
      battleOver = true;
      adventure.player.lampBurn -= 1;
      if (answer.toLowerCase().match(/e|east/g) !== null) {
        setVisableMap(adventure, level, row, columnPlus);
      }
      if (answer.toLowerCase().match(/n|north/g) !== null) {
        setVisableMap(adventure, level, rowMinus, column);
      }
      if (answer.toLowerCase().match(/s|south/g) !== null) {
        setVisableMap(adventure, level, rowPlus, column);
      }
      if (answer.toLowerCase().match(/w|west/g) !== null) {
        setVisableMap(adventure, level, row, columnMinus);
      }
      return showKnownMap(adventure);
    } else if (!adventure.player.lamp) {
      say(
        "Sorry, {0}, you don't have a Lamp.".replace(
          "{0}",
          adventure.player.race
        )
      );
    } else {
      say(
        "Sorry, {0}, your Lamp is out of oil.".replace(
          "{0}",
          adventure.player.race
        )
      );
    }
  }
}

async function movePlayerDownStairs(adventure) {
  if (
    adventure.mape.levels[adventure.player.location[0]].rows[
      adventure.player.location[1]
    ].columns[adventure.player.location[2]].value === "D"
  ) {
    adventure.player.Down();
  } else {
    say(
      "If there were stair going down then you could desend, but there's not."
    );
  }
}

async function movePlayerUpStairs(adventure) {
  if (
    adventure.mape.levels[adventure.player.location[0]].rows[
      adventure.player.location[1]
    ].columns[adventure.player.location[2]].value === "U"
  ) {
    adventure.player.Up();
  } else {
    say("If there were stair going up then you could asend, but there's not.");
  }
}

async function teleportPlayer(adventure) {
  if (adventure.player.runestaff) {
    say("The Runestaff you carry starts to vibrate with energy.");
    do {
      let tempValue;
      do {
        tempValue = await ask(
          "Please enter the destination. (ex. 0,0,3) Meaning Level 0, Row 0, Column 0\n"
        );
        if (tempValue.match(/^\d{1,2},\d{1,2},\d{1,2}$/) === null) {
          say(
            "I understand your a {0} and a little slow.".replace(
              "{0}",
              adventure.player.race
            )
          );
          await wait(1000);
        }
      } while (tempValue.match(/^\d{1,2},\d{1,2},\d{1,2}$/) === null);
      tempValue = tempValue.split(",").map((v) => Number(v));
      function OutOfBounds(coords, adventure) {
        if (coords[0] - 1 > adventure.game.levels.length) return true;
        if (coords[1] - 1 > adventure.game.levels[coords[0] - 1].rows.length)
          return true;
        if (
          coords[2] - 1 >
          adventure.game.levels[coords[0] - 1].rows[coords[1] - 1].columns
            .length
        )
          return true;
        if (coords[0] < 0 || coords[1] < 0 || coords[2] < 0) return true;
        return false;
      }
      if (OutOfBounds(tempValue, adventure)) {
        say(
          "Try picking an existing location on the map {0}".replace(
            "{0}",
            adventure.player.race
          )
        );
      } else {
        monsterIgnore = false;
        say(
          `Teleporting you to Level ${tempValue[0]}, Row ${tempValue[1]}, Column ${tempValue[2]}`
        );
        adventure.player.location[0] = tempValue[0] - 1;
        adventure.player.location[1] = tempValue[1] - 1;
        adventure.player.location[2] = tempValue[2] - 1;
        action = "Teleport";
        nocommand = true;
      }
    } while (action === "T");
  } else {
    say(
      "You shout out into the room\n\t{0} Teleport\nbut thing happens, you realize you need the Runestaff to teleport.".replace(
        "{0}",
        adventure.player.race
      )
    );
  }
}

async function playerAttack(adventure) {
  say(
    "You strike out with your {0} and knock the air right out. Hmm mayber there isn't anything here to attack.".replace(
      "{0}",
      adventure.player.weapon.type === "None"
        ? "hand"
        : adventure.player.weapon.type
    )
  );
}

async function playerRetreat(adventure) {
  say(
    "Time to hi-tail it out of here. Nice one, {0}! Escape with your life, who needs dignity.".replace(
      "{0}",
      adventure.player.race
    )
  );
}

async function playerBribe(adventure) {
  say(
    "Dumb {0}, you cant bribe thin air.".replace("{0}", adventure.player.race)
  );
}

async function hasTreasures(adventure) {}

async function checkPlayerDeath(adventure) {
  if (
    adventure.player.dexterity < 1 ||
    adventure.player.intelligence < 1 ||
    adventure.player.strength < 1
  ) {
    adventure.player.nocommand = true;
    adventure.player.action = "Q";
    return playerDeath(adventure);
  }
}

function playerLocationValue(adventure) {
  return adventure.game.map.levels[adventure.player.location[0]].rows[
    adventure.player.location[1]
  ].columns[adventure.player.location[2]].value;
}

async function play(adventure) {
  do {
    // clear();
    const { player, gameMap } = adventure;
    const { race } = player;
    say(`A ${player.sex} ${race} just entered the castle.`);
    const [level, row, column, monster] = adventure.game.Find.Monster();
    say(adventure.game.GameMessage(monster.race));
    // console.log(gameMap);
    adventure.player.action = "S";
    adventure.player.monsterIgnore = true;
    adventure.player.nocommand = false;
    do {
      await checkPlayerDeath(adventure);
      adventure.player.turns += 1;
      if (playerLocationValue(adventure) === "X") {
        adventure.game.map.levels[adventure.player.location[0]].rows[
          adventure.player.location[1]
        ].columns[adventure.player.location[2]].value = "-";
      }

      sayCurrentPlayerLocation(adventure);
      sayCurrentPlayerStats(adventure);

      if (adventure.player.Runestaff) {
        say("You have the Runestaff!");
      }

      // check player treasures
      await hasTreasures(adventure);
      isCursed(adventure);
      // entrancein room sequence
      if (playerLocationValue(adventure) === "E") {
        say("Here you find the Entrance.");
      } else if (playerLocationValue(adventure) instanceof Treasure) {
        // Treasure Sequence
        say(
          "You find {0}, The {0} is now yours!".replaceAll(
            "{0}",
            adventure.game.map.levels[adventure.player.location[0]].rows[
              adventure.player.location[1]
            ].columns[adventure.player.location[2]].value.type
          )
        );
        adventure.player.treasures.Add(
          adventure.game.map.levels[adventure.player.location[0]].rows[
            adventure.player.location[1]
          ].columns[adventure.player.location[2]].value
        );
        adventure.game.map.levels[adventure.player.location[0]].rows[
          adventure.player.location[1]
        ].columns[adventure.player.location[2]].value = "X";
        adventure.player.known.levels[adventure.player.location[0]].rows[
          adventure.player.location[1]
        ].columns[adventure.player.location[2]].value = "-";
      } else if (playerLocationValue(adventure) === "G") {
        // Gold Sequence
        const gold = AhwaAdeventure.random(1000, 1);
        adventure.player.gold += gold;
        say(`You found ${gold} Gold!`);
        adventure.game.map.levels[adventure.player.location[0]].rows[
          adventure.player.location[1]
        ].columns[adventure.player.location[2]].value = "X";
        adventure.player.known.levels[adventure.player.location[0]].rows[
          adventure.player.location[1]
        ].columns[adventure.player.location[2]].value = "-";
        say(`You found some gold, and now have ${adventure.player.gold} gold.`);
      } else if (playerLocationValue(adventure) === "F") {
        //Flares in room sequence
        say("You have found flares.");
        const flares = AhwaAdeventure.random(10, 1);
        adventure.player.flares += flares;
        adventure.game.map.levels[adventure.player.location[0]].rows[
          adventure.player.location[1]
        ].columns[adventure.player.location[2]].value = "X";
        adventure.player.known.levels[adventure.player.location[0]].rows[
          adventure.player.location[1]
        ].columns[adventure.player.location[2]].value = "-";
        say(
          `You found ${flares} flares, and now have ${adventure.player.flares} flares.`
        );
      } else if (playerLocationValue(adventure) === "S") {
        //Sink Hole in room
        say("You have found a Sink-Hole.");
        say("You sink to the next level!");
        await wait(2000);
        adventure.player.Sink();
        nocommand = true;
      } else if (playerLocationValue(adventure) === "W") {
        // Warp in room
        say("You have found a warp.");
        say("You are being warped!");
        await wait(2000);
        adventure.player.Warp();
        nocommand = true;
      } else if (playerLocationValue(adventure) === "O") {
        // Crystal Orb
        say("You have found a Crystal Orb.");
      } else if (playerLocationValue(adventure) === "D") {
        // Stairs down
        say("You have found stairs leading down.");
      } else if (playerLocationValue(adventure) === "U") {
        // stairs up
        say("You have found stairs leading up.");
      } else if (playerLocationValue(adventure) === "X") {
        // empty room
      } else if (playerLocationValue(adventure) === "B") {
        // book in the room
        say("You have found a book to read.");
      } else if (playerLocationValue(adventure) === "C") {
        // chest in room
        say("You have found a treasure chest.");
      } else if (playerLocationValue(adventure) === "P") {
        // pool in room
        say("Nice, it's a pool. Bet you cant wait to dive in or take a drink.");
      } else if (playerLocationValue(adventure) === "Z") {
        // Orb Of Zot in room
        if (action === "Teleport") {
          say("You have found the Orb-Of-Zot!");
          say("The Runestaff vanishes!");
          adventure.player.OrbOfZot = true;
          adventure.player.Runestaff = false;
          adventure.game.map.levels[adventure.player.location[0]].rows[
            adventure.player.location[1]
          ].columns[adventure.player.location[2]].value = "X";
          adventure.player.known.levels[adventure.player.location[0]].rows[
            adventure.player.location[1]
          ].columns[adventure.player.location[2]].value = "-";
        } else {
          if (!adventure.player.OrbOfZot) {
            nocommand = true;
            if (action === "E") {
              adventure.player.East();
            }
            if (action === "N") {
              adventure.player.North();
            }
            if (action === "S") {
              adventure.player.South();
            }
            if (action === "W") {
              adventure.player.West();
            }
          }
        }
      } else if (playerLocationValue(adventure) instanceof Monster) {
        // Monster or Vendor in room.
        const monster =
          adventure.game.map.levels[adventure.player.location[0]].rows[
            adventure.player.location[1]
          ].columns[adventure.player.location[2]].value;
        say("Here you find a {0}".replace("{0}", monster.race));
        canCast = false;
        if (!monster.mad && monster.race !== "Vendor" && !monsterIgnore) {
          const supriseAttack = await ask(
            "The {0} seems not to notice you, do you want to suprise attack? Enter [(Y)es | (N)o]".replace(
              "{0}",
              monster.race
            )
          );
          if (supriseAttack.toLowerCase().startsWith("y")) {
            //suprise attack
            firstAttachRound = false;
            monster.mad = true;
            await playerAttack();
          } else {
            //dont suprise attack.
            monsterIgnore = true;
            nocommand = true;
          }
        }
        if (monster.race === "Vendor" && !monsterIgnore && !monster.mad) {
          say("You may Ignore, Trade, or Attack.");
          const answer = await ask(
            "What do you want to do?\n" +
              "\t(I)gnore : Ignore the {0}\n\t(T)rade : Trade with the {0}\n\t(A)ttack : Attack the {0}".replaceAll(
                "{0}",
                monster.race
              )
          );
          if (answer.match(/a|attack/g) !== null) {
            firstAttachRound = false;
            allVendorMad = true;
            monster.mad = true;
            playerAttack();
          }
          if (answer.match(/t|trade/g) !== null) {
            await vendorTrade();
            nocommand = true;
          }
          if (answer.match(/i|ignore/g) !== null) {
            monsterIgnore = true;
            nocommand = true;
          }
        }
        battleOver = false;
        firstAttackRound = true;
        while (
          monster.mad &&
          adventure.player.strength > 0 &&
          adventure.player.intelligence > 0 &&
          monster.strength > 0 &&
          !battleOver
        ) {
          let randomMonsterMessages = [
            "The {0} sees you, snarls and lunges towards you!",
            "The {0} looks angrily at you moves in your direction!",
            "The {0} stops what it's doing and focuses its attention on you!",
            "The {0} looks at you agitatedly!",
            monster.race === "Dragon"
              ? "The {0} says, you've come seeking treasure and instead have found death!"
              : "The {0} growls and prepares for battle!",
            monster.race === "Dragon"
              ? "The {0} says, you will be a small meal for a {0}, {1}!"
              : "The {0} growls and prepares for battle!",
            monster.race === "Dragon"
              ? "The {0} says, welcome to your death pitiful {1}!"
              : "The {0} growls and prepares for battle!"
          ];
          let randomMonsterMessage = AhwaAdeventure.randomize(
            randomMonsterMessages
          )[0];
          if (firstAttachRound) {
            say(randomMonsterMessage);
          }
          say("You are facing  a {0}!".replace("{0}", monster.race));
          if (
            AhwaAdeventure.random(100) + monster.dexterity > 75 ||
            (adventure.player.lethary && firstAttachRound)
          ) {
            firstAttachRound = false;
          } else {
            if (
              adventure.player.intelligence > 14 &&
              !adventure.player.lethary
            ) {
              canCast = true;
            }
            if (+adventure.player.dexterity > 50 && firstAttachRound) {
              tempValue = "You may also attempt a bribe.";
            } else {
              tempValue = null;
            }
            say("You may Attack or Retreat.");
            if (canCast) {
              say("You can also Cast a Spell.");
            }
            if (tempValue !== null) {
              say(tempValue);
            }
            say(
              "Your Dexterity is {0}, your Intelligence is {1}, and your strength is {2}."
            );
            let choices;
            if (tempValue === null && !canCast) {
              say("What do you want to do?");
              choices = await ask(
                "\t(A)ttack : Attack the {0}\n\t(R)etreat : Retreat to another room."
              );
            } else if (tempValue === null && canCast) {
              choices = await ask(
                "\t(A)ttack : Attack the {0}\n\t(R)etreat : Retreat to another room.\n\t(C)ast : Cast a Spell."
              );
            } else if (tempValue && !canCast) {
              choices = await ask(
                "\t(A)ttack : Attack the {0}\n\t(R)etreat : Retreat to another room.\n\t(B)ribe : Attempt to bribe the {0}."
              );
            } else if (tempValue && canCast) {
              choices = await ask(
                "\t(A)ttack : Attack the {0}\n\t(R)etreat : Retreat to another room.\n\t(C)ast : Cast a Spell.\n\t(B)ribe : Attempt to bribe the {0}."
              );
            }
            if (choices.toLowerCase().match(/c|cast/g) !== null) {
              firstAttachRound = false;
            }
            if (choices.toLowerCase().match(/a|attack/g) !== null) {
              firstAttachRound = false;
              playerAttack();
            }
            if (choices.toLowerCase().match(/r|retreat/g) !== null) {
            }
            if (choices.toLowerCase().match(/b|bribe/g) !== null) {
              firstAttachRound = false;
            }
          }
        }
      }

      if (
        ["B", "C", "F", "G", "O", "P", "D", "U", "X"].indexOf(
          adventure.game.map.levels[adventure.player.location[0]].rows[
            adventure.player.location[1]
          ].columns[adventure.player.location[2]].value
        ) !== -1
      ) {
        if (AhwaAdeventure.random(90) > 59) {
          const [level, row, column, monster] = adventure.game.Find.Monster();
          say(adventure.game.GameMessage(monster.race));
        }
      }

      await checkPlayerDeath(adventure);

      if (adventure.player.nocommand === false) {
        await wait(1000);
        clear();
        showMenu();
        // ShowActions();
        let answer = await ask("Your command?");
        switch (answer.toLowerCase().substring(0, 1)) {
          case "m": //Map
            await showMap(adventure);
            break;
          case "g": //Gaze
            await gazeInToOrb(adventure);
            break;
          case "o": //Open
            await openABook(adventure);
            break;
          case "p": //Drink
            await drinkFromPool(adventure);
            break;
          case "f": //Light A Fla
            await lightAFlair(adventure);
            break;
          case "l": //Shine a Lamp
            await shineALamp(adventure);
            break;
          case "e": //ENSW
            adventure.player.monsterIgnore = false;
            adventure.player.East();
            break;
          case "n": //ENSW
            adventure.player.monsterIgnore = false;
            adventure.player.North();
            break;
          case "s": //ENSW
            adventure.player.monsterIgnore = false;
            adventure.player.South();
            break;
          case "w": //ENSW
            adventure.player.monsterIgnore = false;
            adventure.player.West();
            break;
          case "d": //Down Stairs
            await movePlayerDownStairs(adventure);
            break;
          case "u": //Up Stairs
            await movePlayerUpStairs(adventure);
            break;
          case "t": //Teleport
            await teleportPlayer(adventure);
            break;
          case "a": //Attach
            await playerAttack(adventure);
            break;
          case "r": //Retreat
            await playerRetreat(adventure);
            break;
          case "b": //Bribe
            await playerBribe(adventure);
            break;
          default:
            adventure.player.action = "Q";
            return end();
        }
      } else {
        adventure.player.nocommand = false;
      }
    } while (adventure.player.action !== "Q");
    adventure.running = false;
  } while (adventure.running);
}

async function end() {
  rl.close();
  // clear();
  say("Thanks for taking an Adventure with Ahwa!");
  process.exit();
}

async function main() {
  clear();
  intro();
  await wait(3000);
  clear();
  await instructions();
  await wait(2000);
  clear();
  // ToDo :: Reorganize Map Selection till after Character Selection.
  const mapType = await selectMapType();
  const gameMap = await generateMap(mapType);
  await wait(1000);
  clear();
  const player = await createCharacter(gameMap);
  const adventure = {
    gameMap,
    player
  };
  await setGamePlayLocation(adventure);
  await assignExtraPoints(adventure);
  await wait(1500);
  await selectArmor(adventure);
  await wait(1500);
  await selectWeapon(adventure);
  await wait(1500);
  await buyLampAndOil(adventure);
  await wait(1500);
  await buyFlares(adventure);
  //ToDo :: Add Host/Join Selection Menu
  await initializeKnownMap(adventure);
  await wait(1500);
  await setRunestaff(adventure);
  // clear();
  await start(adventure);
  await play(adventure);
  await end(adventure);
}

main();
