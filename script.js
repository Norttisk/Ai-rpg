const outputDiv = document.getElementById("outputEl");
const customActionInput = document.getElementById("customActionInputEl");
const customActionBtn = document.getElementById("customActionBtn");
const fileInput = document.getElementById("file-input");
const playerInfoBtn = document.getElementById("player-info-btn");
const inventoryBtn = document.getElementById("inventory-btn");
const storyLogBtn = document.getElementById("storyLogBtn");
const storyLogEl = document.getElementById("storyLogEl");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementsByClassName("close")[0];

let playerName = "";
let playerAttributes;
let events = [];
let inventory = ["Sword", "Health Potion"];

const startGame = () => {
    playerName = customActionInputEl.value;
    playerAttributes = {
        level: 1,
        health: 100,
        gold: 50,
    };
    outputDiv.innerHTML = `Chào mừng ${playerName}, bạn đã sẵn sàng! Cấp độ của bạn: ${playerAttributes.level}. Nhập lệnh để tiếp tục.`;
    customActionInput.value = "";
};

const loadEvents = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target.result);
            events = json.events;
            outputDiv.innerHTML += `<p>Đã tải xong sự kiện.</p>`;
        } catch (error) {
            outputDiv.innerHTML += `<p>Có lỗi khi tải file JSON: ${error.message}</p>`;
        }
    };
    reader.readAsText(file);
};

const processInput = (input) => {
    const command = input.toLowerCase();
    const matchedEvent = events.find((event) =>
        event.keyword.split("|").some((keyword) => command.includes(keyword))
    );

    if (
        matchedEvent &&
        eval(matchedEvent.condition.replace("player.", "playerAttributes."))
    ) {
        outputDiv.innerHTML += `<p>${matchedEvent.content}</p>`;
        matchedEvent.available_choices.forEach((choice) => {
            outputDiv.innerHTML += `<button class="choice">${choice.choice}</button>`;
        });
    } else {
        outputDiv.innerHTML += `<p>Không có sự kiện nào phù hợp hoặc điều kiện không thỏa mãn.</p>`;
    }
};

customActionBtn.addEventListener("click", () => {
    if (playerName.trim() == "" && customActionInput.value === "") {
        outputDiv.innerHTML = "Vui lòng nhập tên của bạn.";
        return;
    }

    if (playerName.trim() == "" && customActionInput.value != null) {
        startGame();
    } else {
        if (customActionInput.value === "") {
            outputDiv.innerHTML = "Vui lòng nhập hành động của bạn.";
        } else {
            processInput(customActionInput.value);
        }
    }
});

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        loadEvents(file);
    }
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("choice")) {
        const choiceText = event.target.innerText;
        const matchedEvent = events.find((event) =>
            event.available_choices.some(
                (choice) => choice.choice === choiceText
            )
        );
        const selectedChoice = matchedEvent.available_choices.find(
            (choice) => choice.choice === choiceText
        );
        const outcome =
            Math.random() < selectedChoice.success_rate
                ? selectedChoice.outcome
                : "Bạn đã thất bại trong lựa chọn này.";
        outputDiv.innerHTML += `<p>${outcome}</p>`;
        storyLogEl.value += `\n${playerName} đã chọn: ${choiceText}\nKết quả: ${outcome}`;
    }
});

playerInfoBtn.addEventListener("click", () => {
    modalTitle.textContent = "Thông tin nhân vật";
    modalBody.innerHTML = `
        <p><strong>Tên:</strong> ${playerName}</p>
        <p><strong>Cấp độ:</strong> ${playerAttributes.level}</p>
        <p><strong>Máu:</strong> ${playerAttributes.health}</p>
        <p><strong>Vàng:</strong> ${playerAttributes.gold}</p>
    `;
    modal.style.display = "block";
});

inventoryBtn.addEventListener("click", () => {
    modalTitle.textContent = "Hành trang";
    modalBody.innerHTML = `
        <ul>
            ${inventory.map((item) => `<li>${item}</li>`).join("")}
        </ul>
    `;
    modal.style.display = "block";
});

storyLogBtn.addEventListener("click", () => {
    modalTitle.textContent = "Lịch sử";
    modalBody.textContent = storyLogEl.value;
    modal.style.display = "block";
});

closeBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
