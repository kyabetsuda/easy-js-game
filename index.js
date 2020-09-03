//===========================================
// グローバル変数定義
var person;
var monsters = [];

// 定数定義
const NUMBER_OF_MONSTER = 2;

// main関数起動
main();
//===========================================

/* ゲームスタート */
function gameStart(){
    document.getElementById("start").style.display = "none";
    document.getElementById("game").style.display = "flex";
    var audio = document.getElementById("bgm1");
    audio.loop = true;
    audio.play();
}

/* メイン処理 */
function main() {
    // 主人公を取得
    person = getPerson();
    insertStatus(person);
    
    // モンスターを取得
    getMonsterAll();

    // 初期化処理
    initialize();
}

/* 初期化コマンド */
function initialize() {
    document.getElementById("fight").addEventListener("click",fight);
    document.getElementById("defence").addEventListener("click",defence);
}

/* 戦うキャラクターを取得 */
function getPerson() {
    var person = new Person("tanaka", "田中", 200, 20, STRENGTH_STRONG);
    var rand = getRandomInt(10);
    if (rand % 3 == 0) {
        person = new Person("satou", "佐藤", 150, 50, STRENGTH_STRONG)
        return person;
    }
    return person;
}

/* モンスターを取得し、セットする */
function getMonsterAll() {
    for (var i = 0; i < NUMBER_OF_MONSTER; i++) {
        var monster = getMonster();
        monsters.push(monster);
    }
    addMonsters(monsters);
}

/* モンスターをセットする */
function addMonsters(monsters) {
    var screen = document.getElementById("screen");
    
    // モンスター部分の子要素を削除
    while (screen.firstChild) {
        screen.removeChild(screen.firstChild);
    }
    
    // モンスターを追加する
    for (var monster of monsters) {
        if(!monster.isAlive) {
            continue;
        }
        var img = document.createElement("img");
        img.src = "img/" + monster.name + ".png";
        img.setAttribute("class", monster.imgClassName);
        screen.appendChild(img);
    }
}

/* モンスターを返却する */
function getMonster() {
    var monster = new Monster("slime", "slime1", "スライム", 10, 20, STRENGTH_WEAK);
    var rand = getRandomInt(10);
    if (rand % 3 == 0) {
        monster = new Monster("dorasiru", "dorasiru1", "ユグドラシル", 100, 20, STRENGTH_STRONG);
    }
    return monster;
}

/* 戦うコマンド */
async function fight() {
    // コマンドを非表示
    document.getElementById("command").style.display="none";

    // 主人公の攻撃
    await doPersonAttack(person, monsters);
    
    // モンスターの攻撃
    for (var monster of monsters) {
        if (!monster.isAlive) {
            continue;
        }
        await doMonsterAttack(person, monster);
    }

    // 後処理
    hideChatBox();
    document.getElementById("command").style.display="block";
}

/* 防御コマンド */
async function defence() {
    // コマンドを非表示
    document.getElementById("command").style.display="none";
    
    // 防御の有効化
    person.isDefence = true;
    
    // 主人公の攻撃
    await sleep(1000);
    showChatBox(person.nameKana + "は防御している");
    await sleep(1000);
    
    // モンスターの攻撃
    for (var monster of monsters) {
        if (!monster.isAlive) {
            continue;
        }
        await doMonsterAttack(person, monster);
    }
    
    // 後処理
    hideChatBox();
    document.getElementById("command").style.display="block";
    person.isDefence = false;
}

/* 味方の攻撃 */
async function doPersonAttack(person, monsters) {
    // ランダムでモンスターを取得
    var monster = getMonsterByRandom(monsters);

    // 攻撃処理
    await sleep(1000);
    showChatBox("攻撃！");
    await sleep(500);
    document.getElementById("attack1").play();
    await sleep(1000);
    var damageByPerson = await doDamage(person, monster);
    document.getElementById("attack2").play();
    showChatBox(monster.nameKana + "に" + damageByPerson + "のダメージ！");
    console.log("敵のHP" + monster.hp);
    await sleep(1000);

    // 敵のhpで条件分岐
    if (monster.hp <= 0) {
        showChatBox(monster.nameKana + "を倒した！");
        // isAlive = false;
        monster.isAlive = false;
        // モンスター再描画
        await sleep(1000);
        addMonsters(monsters);
        // 敵の数が0かどうかチェック
        if (!checkIfAllMonstersAlive()) {
            // 勝利音を流す
            document.getElementById("bgm1").pause();
            document.getElementById("shouri").play();
            // ユーザの勝利
            showChatBox("戦闘に勝利した！ゲームクリア！");
            throw new Error("user win!");
        }
    }
    await sleep(1000);
}

/* モンスターをランダムで取得 */
function getMonsterByRandom(monsters) {
    // isAlive = falseの場合、次のmonsterを選択
    var monster = monsters[getRandomInt(monsters.length)];
    while (!monster.isAlive) {
        monster = monsters[getRandomInt(monsters.length)];
    }
    return monster;
}

/* すべてのモンスターが生存しているかどうかチェック */
function checkIfAllMonstersAlive() {
    for (var monster of monsters) {
        if (monster.isAlive) {
            return true;
        }
    }
    return false;
}

/* モンスターの攻撃 */
async function doMonsterAttack(person, monster) {
    // 攻撃処理
    showChatBox(monster.nameKana + "の攻撃！");
    await sleep(500);
    document.getElementById("attack3").play();
    await sleep(1000);
    var damageByMonster = await doDamage(monster, person);
    document.getElementById("attack2").play();
    showChatBox(person.nameKana + "に" + damageByMonster + "のダメージ！");
    await sleep(1000);
    insertStatus(person);

    // 主人公のhpで条件分岐
    if (person.hp <= 0) {
        showChatBox(person.nameKana + "はやられてしまった！");
        // 悲壮の音楽を流す
        document.getElementById("bgm1").pause();
        document.getElementById("hisou").play();
        throw new Error("game over");
    }
}

/* ダメージを与える */
async function doDamage(attacker, attackee) {
    var damageMap = attacker.attack();
    var damage = damageMap.get('damage');

    // 攻撃を受ける側が防御モードの場合
    if (attackee.isDefence) {
        damage = Math.floor(damage / 2);
    }
    
    // 痛恨の一撃の場合
    if (damageMap.get('criticalFlag')) {
        await sleep(500);
        showChatBox("痛恨の一撃！");
        await sleep(500);
    }
    attackee.hp = attackee.hp - damage;
    return damage;
}

/* 主人公のステータスを挿入 */
function insertStatus(person) {
    // parent
    var status = document.createElement("div");
    status.setAttribute("class","status");

    // inner
    var statusInner = document.createElement("div");
    statusInner.setAttribute("class","statusInner");
    
    // name
    var nameElm = document.createElement("div");
    nameElm.innerText = person.nameKana;
    statusInner.appendChild(nameElm);

    // hp
    var hpElm = document.createElement("div");
    var hp = person.hp < 0 ? 0 : person.hp;
    hpElm.innerText = "HP : " + hp;
    statusInner.appendChild(hpElm);

    // mp
    var mpElm = document.createElement("div");
    mpElm.innerText = "MP : " + person.mp;
    statusInner.appendChild(mpElm);

    // statusInnerをstatusに追加
    status.appendChild(statusInner);

    // statusをheaderに追加
    var header = document.getElementById("header");
    // headerの要素を削除
    // while (header.firstChild) {
    //     header.removeChild(header.firstChild);
    // }
    header.appendChild(status);
}

/* チャットボックス表示 */
function showChatBox(str) {
    var chatbox = document.getElementById("chatbox");
    chatbox.innerText = str;
    chatbox.style.display="block";
}

/* チャットボックス非表示 */
function hideChatBox() {
    var chatbox = document.getElementById("chatbox");
    chatbox.style.display="none";
}