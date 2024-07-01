window.onload = function () {
  fetchIPs()
    .then(({ su_ip, ji_ip }) => {
      const chatMessages = document.querySelector("#chat-messages");
      const userInput = document.querySelector("#user-input input");
      const sendButton = document.querySelector(
        ".buttons-container .send-button"
      );

      function addMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.className = `message ${sender}`;
        messageElement.textContent = message;
        chatMessages.prepend(messageElement);
      }

      async function fetchAIResponse(prompt) {
        const response = await fetch(`http://${ji_ip}:3000/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: prompt }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        return data.response;
      }

      sendButton.addEventListener("click", async () => {
        const message = userInput.value.trim();
        if (message.length === 0) return;
        addMessage("user", message);
        userInput.value = "";
        userInput.placeholder = "메시지를 입력하세요...";
        try {
          const aiResponse = await fetchAIResponse(message);
          addMessage("bot", aiResponse);
        } catch (error) {
          addMessage("bot", `오류 발생: ${error.message}`);
        }
      });

      userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          sendButton.click();
        }
      });

      const startButton = document.getElementById("start");
      startButton.addEventListener("click", () => {
        const chatContainer = document.getElementById("chat-container");
        if (
          chatContainer.style.visibility === "hidden" ||
          chatContainer.style.visibility === ""
        ) {
          chatContainer.style.visibility = "visible";
        } else {
          chatContainer.style.visibility = "hidden";
        }
      });
    })
    .catch((error) => {
      console.error("Failed to fetch IPs:", error);
    });
};

// 서버로 POST 요청을 보내고 환경변수를 받아오는 함수
async function fetchIPs() {
  try {
    const response = await fetch("/ip", { method: "POST" });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return { su_ip: data.su_ip, ji_ip: data.ji_ip };
  } catch (error) {
    console.error("Failed to fetch IPs:", error);
    return { su_ip: "", ji_ip: "" };
  }
}
