const animals = {
    "🐭 Souris":100,
    "🐰 Lapin":150,
    "🐕 Chien":300,
    "🐺 Loup":500,
    "🦌 Cerf":550,
    "🦍 Gorille":800,
    "🐅 Tigre":900,
    "🦏 Rhinocéros":1200,
    "🐘 Éléphant":1500
};

function createRow() {

    const row = document.createElement("div");
    row.className = "animal-row";

    const select = document.createElement("select");

    Object.keys(animals).forEach(a => {
        const option = document.createElement("option");
        option.value = a;
        option.textContent = a;
        select.appendChild(option);
    });

    const qty = document.createElement("input");
    qty.type = "number";
    qty.min = 1;
    qty.value = 1;

    row.appendChild(select);
    row.appendChild(qty);

    return row;
}

function resetTeams(){
	const containerA =
        document.querySelector("#teamA .animals");
	containerA.innerHTML = "";
	const containerB =
        document.querySelector("#teamB .animals");
	containerB.innerHTML = "";
	addAnimal("A");
	addAnimal("B");
}

function addAnimal(team){

    const container =
        document.querySelector(
            team === "A"
            ? "#teamA .animals"
            : "#teamB .animals"
        );

    container.appendChild(createRow());
}

addAnimal("A");
addAnimal("B");

function computeTeam(teamId){

    const rows =
        document.querySelectorAll(
            `#team${teamId} .animal-row`
        );

    let totalPower = 0;
    let totalUnits = 0;

    const details = [];

    rows.forEach(row => {

        const animal =
            row.querySelector("select").value;

        const qty =
            parseInt(row.querySelector("input").value);

        const power =
            animals[animal] * qty;

        totalPower += power;
        totalUnits += qty;

        details.push(
            `${qty} x ${animal}`
        );
    });

	const effectif = 1 + Math.sqrt(totalUnits - 1);
    const bonus =
        1 + Math.log(totalUnits || 1);

    totalPower += bonus;
	totalPower *= effectif;

    return {
        power: totalPower,
        units: totalUnits,
        details
    };
}

document
.getElementById("fightBtn")
.addEventListener("click", () => {

    const A = computeTeam("A");
    const B = computeTeam("B");

    const probA =
        1 /
        (1 +
        Math.pow(
            10,
            (B.power - A.power)/400
        ));

    const winner =
        Math.random() < probA
        ? "A"
        : "B";

    const log = document.getElementById("log");

    let text = "";

    text += "=== COMBAT ===\n\n";

    text += "Equipe A\n";
    text += A.details.join("\n");
    text += "\nForce : " +
        A.power.toFixed(0);

    text += "\n\n";

    text += "Equipe B\n";
    text += B.details.join("\n");
    text += "\nForce : " +
        B.power.toFixed(0);

    text += "\n\n";

    text +=
        `Chance victoire A : ${(probA*100).toFixed(1)}%\n`;

    text +=
        `Chance victoire B : ${((1-probA)*100).toFixed(1)}%\n\n`;

    text +=
        `🏆 Vainqueur : Equipe ${winner}`;

    log.textContent = text;

    document.getElementById("result")
        .textContent =
        `🏆 Equipe ${winner} gagne !`;
});