let eggCount = 0;
let legacyEggCount = 0;
let assets = {
    chicken: 0,
    farm: 0,
    factory: 0,
    laboratory: 0,
    shrine: 0,
    golden_goose: 0,
    god: 0
};
let multipliers = {
    click: 1, 
    chicken: 1,
    farm: 5,
    factory: 75, 
    laboratory: 1200,
    shrine: 20000,
    golden_goose: 500000,
    god: 10000000
};
let exponential = { 
    chicken: 1.05,
    farm: 1.1,
    factory: 1.15, 
    laboratory: 1.2,
    shrine: 1.25,
    golden_goose: 1.3,
    god: 1.35
};

const clickUpgrades = [
    { cost: 50, multiplier: 2, legacyThreshold: 50 },
    { cost: 500, multiplier: 2, legacyThreshold: 500 },
    { cost: 1000, multiplier: 3, legacyThreshold: 5000 },
    { cost: 5000, multiplier: 3, legacyThreshold: 10000 },
    { cost: 10000, multiplier: 4, legacyThreshold: 50000 }, 
    { cost: 50000, multiplier: 4, legacyThreshold: 100000 },
    { cost: 100000, multiplier: 5, legacyThreshold: 500000 },
    { cost: 1000000, multiplier: 5, legacyThreshold: 5000000 },
    { cost: 10000000, multiplier: 6, legacyThreshold: 50000000 },
    { cost: 100000000, multiplier: 6, legacyThreshold: 500000000 },
    { cost: 1000000000, multiplier: 10, legacyThreshold: 5000000000 },
];
const chickenUpgrades = [
    { cost: 80, multiplier: 2, legacyThreshold: 50 },
    { cost: 500, multiplier: 2, legacyThreshold: 100 },
    { cost: 1000, multiplier: 2, legacyThreshold: 500 },
    { cost: 5000, multiplier: 3, legacyThreshold: 10000 },
    { cost: 10000, multiplier: 3, legacyThreshold: 50000 }, 
    { cost: 50000, multiplier: 3, legacyThreshold: 100000 },
    { cost: 100000, multiplier: 4, legacyThreshold: 500000 },
    { cost: 1000000, multiplier: 4, legacyThreshold: 5000000 },
    { cost: 10000000, multiplier: 4, legacyThreshold: 50000000 },
    { cost: 100000000, multiplier: 5, legacyThreshold: 500000000 },
    { cost: 1000000000, multiplier: 10, legacyThreshold: 5000000000 },
];
const farmUpgrades = [
    { cost: 500, multiplier: 2, legacyThreshold: 200 },
    { cost: 1000, multiplier: 2, legacyThreshold: 500 },
    { cost: 5000, multiplier: 2, legacyThreshold: 10000 },
    { cost: 10000, multiplier: 3, legacyThreshold: 50000 },
    { cost: 50000, multiplier: 3, legacyThreshold: 100000 }, 
    { cost: 100000, multiplier: 3, legacyThreshold: 500000 },
    { cost: 1000000, multiplier: 4, legacyThreshold: 5000000 },
    { cost: 10000000, multiplier: 4, legacyThreshold: 50000000 },
    { cost: 100000000, multiplier: 4, legacyThreshold: 500000000 },
    { cost: 1000000000, multiplier: 5, legacyThreshold: 5000000000 },
];
const factoryUpgrades = [
    { cost: 5000, multiplier: 2, legacyThreshold: 10000 },
    { cost: 10000, multiplier: 2, legacyThreshold: 50000 },
    { cost: 50000, multiplier: 2, legacyThreshold: 100000 },
    { cost: 100000, multiplier: 3, legacyThreshold: 500000 }, 
    { cost: 1000000, multiplier: 3, legacyThreshold: 5000000 },
    { cost: 10000000, multiplier: 3, legacyThreshold: 50000000 },
    { cost: 100000000, multiplier: 3, legacyThreshold: 500000000 },
    { cost: 1000000000, multiplier: 3, legacyThreshold: 5000000000 }
];
const laboratoryUpgrades = [
    { cost: 50000, multiplier: 2, legacyThreshold: 50000 },
    { cost: 75000, multiplier: 2, legacyThreshold: 100000 },
    { cost: 100000, multiplier: 2, legacyThreshold: 500000 }, 
    { cost: 1000000, multiplier: 2, legacyThreshold: 5000000 },
    { cost: 10000000, multiplier: 3, legacyThreshold: 50000000 },
    { cost: 100000000, multiplier: 3, legacyThreshold: 500000000 },
    { cost: 1000000000, multiplier: 3, legacyThreshold: 5000000000 }
];
const shrineUpgrades = [
    { cost: 750000, multiplier: 2, legacyThreshold: 1000000 }, 
    { cost: 1000000, multiplier: 2, legacyThreshold: 5000000 },
    { cost: 10000000, multiplier: 2, legacyThreshold: 50000000 },
    { cost: 100000000, multiplier: 2, legacyThreshold: 500000000 },
    { cost: 1000000000, multiplier: 2, legacyThreshold: 5000000000 }
];
const golden_gooseUpgrades = [
    { cost: 20000000, multiplier: 2, legacyThreshold: 50000000 }, 
    { cost: 50000000, multiplier: 2, legacyThreshold: 100000000 },
    { cost: 100000000, multiplier: 2, legacyThreshold: 500000000 },
    { cost: 1000000000, multiplier: 2, legacyThreshold: 5000000000 }
];
const godUpgrades = [
    { cost: 10000000000, multiplier: 2, legacyThreshold: 20000000000 },
    { cost: 50000000000, multiplier: 2, legacyThreshold: 100000000000 }
];

const eggButton = document.getElementById("egg-button");
const eggCountDisplay = document.getElementById("egg-count");
const eggsPerSecondDisplay = document.getElementById("eggs-per-second");
const eggsPerClickDisplay = document.getElementById("eggs-per-click");
window.onload = function() {
    checkUpgrades(); 
};


function formatNumber(number) {
    if (number >= 1e12) {
        return (number / 1e12).toFixed(2) + "T";
    } else if (number >= 1e9) {
        return (number / 1e9).toFixed(2) + "B"; 
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(2) + "M"; 
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(2) + "K"; 
    } else {
        return number.toString(); 
    }
}

eggButton.addEventListener("click", () => {
    eggCount += multipliers["click"]; 
    legacyEggCount += multipliers["click"];
    eggCountDisplay.textContent = formatNumber(eggCount);  
});

function passiveEggGeneration() {
    const eggsFromChickens = assets.chicken * multipliers.chicken;
    const eggsFromFarms = assets.farm * multipliers.farm;
    const eggsFromFactories = assets.factory * multipliers.factory;
    const totalEggsPerSecond = eggsFromChickens + eggsFromFarms + eggsFromFactories;

    eggCount += totalEggsPerSecond; 
    legacyEggCount += totalEggsPerSecond;
    eggCountDisplay.textContent = formatNumber(eggCount); 
    eggsPerSecondDisplay.textContent = formatNumber(totalEggsPerSecond);
    eggsPerClickDisplay.textContent = formatNumber(multipliers["click"]);
    checkUpgrades();
}
setInterval(passiveEggGeneration, 1000);

function updateButtonStates() {
    document.querySelectorAll(".buy-asset").forEach(button => {
        const cost = parseInt(button.getAttribute("data-cost"));
        if (eggCount < cost) {
            button.classList.add('unaffordable'); 
        } else {
            button.classList.remove('unaffordable'); 
        }
    });
    document.querySelectorAll(".buy-upgrade").forEach(button => {
        const cost = parseInt(button.getAttribute("data-cost"));
        if (eggCount < cost) {
            button.classList.add('unaffordable'); 
        } else {
            button.classList.remove('unaffordable'); 
        }
    });
}
setInterval(updateButtonStates, 100); 

function createUpgrades(asset, upgrades) {
    const upgradeSection = document.getElementById("upgrades-section");

    upgrades.forEach((upgrade, index) => {
        const button = document.createElement("button");
        button.classList.add("buy-upgrade");
        button.setAttribute("data-asset", asset);
        button.setAttribute("data-cost", upgrade.cost);
        button.setAttribute("data-multiplier", upgrade.multiplier);
        button.setAttribute("data-legacy-threshold", upgrade.legacyThreshold);
        button.setAttribute("data-purchased", "false");
        button.innerHTML = `Upgrade ${asset}: x${upgrade.multiplier} - ${formatNumber(upgrade.cost)}`;

        upgradeSection.appendChild(button);
    });
}
function sortUpgradesByCost() {
    const upgradesSection = document.getElementById("upgrades-section");
    const upgrades = Array.from(document.querySelectorAll(".buy-upgrade"));

    upgrades.sort((a, b) => {
        const costA = parseInt(a.getAttribute("data-cost"));
        const costB = parseInt(b.getAttribute("data-cost"));
        return costA - costB;
    });

    upgradesSection.innerHTML = ""; 
    upgrades.forEach(upgrade => upgradesSection.appendChild(upgrade)); 
}
createUpgrades("click", clickUpgrades);
createUpgrades("chicken", chickenUpgrades);
createUpgrades("farm", farmUpgrades);
createUpgrades("factory", factoryUpgrades);
createUpgrades("laboratory", laboratoryUpgrades);
createUpgrades("shrine", shrineUpgrades);
createUpgrades("golden_goose", golden_gooseUpgrades);
createUpgrades("god", godUpgrades);
sortUpgradesByCost();

function checkUpgrades() {
    document.querySelectorAll(".buy-upgrade").forEach(upgrade => {
        const legacyThreshold = parseInt(upgrade.getAttribute("data-legacy-threshold"));
        const purchased = upgrade.getAttribute("data-purchased") === "true";
        if (!purchased && legacyEggCount >= legacyThreshold) {
            upgrade.style.display = "inline-block"; 
        } else {
            upgrade.style.display = "none";
        }
    });
}

function createAssetButton(assetName) {
    const button = document.createElement("button");
    button.classList.add("buy-asset");
    button.setAttribute("data-asset", assetName);
    button.setAttribute("data-cost", calculatePrice(assetName));

    const img = document.createElement("img");
    img.src = `assets/${assetName}.png`; 
    img.alt = `${assetName} icon`;
    img.style.width = "30px"; 
    img.style.height = "30px";

    const span = document.createElement("span");
    span.textContent = `${assetName.charAt(0).toUpperCase() + assetName.slice(1)} - (${formatNumber(calculatePrice(assetName))})`;
    button.appendChild(img);
    button.appendChild(span);
    return button;
}


function calculatePrice(assetName) {
    const basePrice = parseInt(document.querySelector(`button[data-asset="${assetName}"]`).getAttribute("data-cost"));
    const owned = assets[assetName];
    return Math.floor(basePrice * Math.pow(exponential[assetName], owned));
}

document.querySelectorAll(".buy-upgrade").forEach(upgrade => {
    upgrade.addEventListener("click", () => {
        const asset = upgrade.getAttribute("data-asset"); 
        const cost = parseInt(upgrade.getAttribute("data-cost"));
        const upgradeMultiplier = parseInt(upgrade.getAttribute("data-multiplier"));

        if (eggCount >= cost) {
            eggCount -= cost; 
            multipliers[asset] *= upgradeMultiplier; 
            upgrade.setAttribute("data-purchased", "true");
            upgrade.style.display = "none"; 
        }
    });
});

function updateTooltip(button, assetName) {
    const tooltip = button.querySelector(".tooltip");
    const owned = assets[assetName];
    const production = multipliers[assetName]; 
    tooltip.innerHTML = `Owned: ${owned}<br>Per second: ${formatNumber(production)}`;
}

document.querySelectorAll(".buy-asset").forEach(button => {
    const assetName = button.getAttribute("data-asset");

    button.addEventListener("mouseenter", () => {
        updateTooltip(button, assetName);
    });

    button.addEventListener("click", () => {
        const asset = button.getAttribute("data-asset");
        const cost = parseInt(button.getAttribute("data-cost"));

        if (eggCount >= cost) {
            eggCount -= cost;
            assets[asset] += 1; 
            const nextPrice = calculatePrice(asset);
            button.setAttribute("data-cost", nextPrice);
            const span = button.querySelector("span");
            span.textContent = `${asset.charAt(0).toUpperCase() + asset.slice(1)} - ${formatNumber(nextPrice)}`;
            eggCountDisplay.textContent = formatNumber(eggCount);
        }
    });
});

window.addEventListener("beforeunload", function (event) {
    updateScore('clicker', legacyEggCount); 
    event.preventDefault();
    event.returnValue = ''; 
});
