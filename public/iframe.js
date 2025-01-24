const getIframeSSO = async (service_id, frame_type, login_type) => {
	const style = document.createElement("style");
	style.innerHTML = `
        .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6); 
            z-index: 1000; 
            display: none;
        }

.iframe-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  max-width: 500px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  height: 80%;
  display: none;
   border-bottom: 5px solid #1876D0;
      border-top: 5px solid #1876D0;

}

iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}

/* Media query for mobile devices */
@media (max-width: 768px) {
  .iframe-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100%; /* Ensure the container takes up full width */
    max-height: 100%; /* Ensure the container takes up full height */
    transform: none; /* Reset transform */
    border-radius: 0; /* Reset border-radius */
    box-shadow: none; /* Remove box-shadow if needed */
    z-index: 1001;
    display: none;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 0; /* Reset border-radius */
  }
}

@media (min-width: 2560px) {
  .iframe-container {
    height: 45%; /* Adjust the height as needed for 2K and 4K screens */
  }
}



        .loader {
            border: 4px solid #f3f3f3;
            border-radius: 50%;
            border-top: 4px solid #3498db;
            width: 30px;
            height: 30px;
            -webkit-animation: spin 2s linear infinite; /* Safari */
            animation: spin 2s linear infinite;

            top: 36%;
            position: absolute;
            left: 48%;
            transform: translate(-50%, -50%);
          }
        
          /* Safari */
          @-webkit-keyframes spin {
            0% { -webkit-transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); }
          }
        
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }


          
    `;

	const closeButton = document.createElement("button");
	closeButton.textContent = "X";
	closeButton.className = "close-button";

	closeButton.style.position = "absolute";
	closeButton.style.top = "10px"; // Adjust the top value as needed
	closeButton.style.right = "10px"; // Adjust the right value as needed
	closeButton.style.backgroundColor = "#1876D1";
	closeButton.style.color = "white";
	closeButton.style.border = "none";
	closeButton.style.padding = "5px 10px";
	closeButton.style.borderRadius = "5px";
	closeButton.style.cursor = "pointer";

	closeButton.addEventListener("click", closeIframe);

	// Define a function to close the iframe and hide the backdrop
	function closeIframe() {
		window.parent.location.reload();

		iframeContainer.style.display = "none";
		backdrop.style.display = "none";
	}

	document.head.appendChild(style);

	const iframe = document.createElement("iframe");

	iframe.src = "";
	if (frame_type === "register") {
		iframe.src =
			"http://localhost:3001/registration-iframe?service_id=" +
			service_id +
			"&is_iframe=true" +
			"&login_type=" +
			login_type;
	} else if (frame_type === "forgot_password") {
		iframe.src =
			"http://localhost:3001/forgot-iframe?service_id=" +
			service_id +
			"&is_iframe=true" +
			"&login_type=" +
			login_type;
	} else if (frame_type === "change_email") {
		iframe.src =
			"http://localhost:3001/change-email-iframe?service_id=" +
			service_id +
			"&is_iframe=true" +
			"&login_type=" +
			login_type;
	} else {
		iframe.src =
			"http://localhost:3001/login-iframe?service_id=" +
			service_id +
			"&is_iframe=true" +
			"&login_type=" +
			login_type;
	}
	iframe.id = "dynamicIframe";

	var dynamicIframe = document.getElementById("dynamicIframe");

	if (dynamicIframe) {
		var parent = dynamicIframe.parentNode;
		if (parent) {
			parent.removeChild(dynamicIframe);
		} else {
			console.error("Parent node not found");
		}
	} else {
		console.error("Iframe not found");
	}

	closeButton.addEventListener("click", closeIframe);

	const backdrop = document.querySelector(".backdrop");
	backdrop.style.display = "block";

	const iframeContainer = document.querySelector(".iframe-container");
	iframeContainer.style.display = "block";

	const existingCloseButton = iframeContainer.querySelector(".close-button");

	if (!existingCloseButton) {
		iframeContainer.appendChild(closeButton);
	}

	const existingIframe = iframeContainer.querySelector("iframe");

	if (!existingIframe) {
		iframeContainer.appendChild(iframe);

		const loader = document.createElement("div");
		loader.className = "loader";

		// Append the loader to the iframeContainer
		iframeContainer.appendChild(loader);

		iframe.onload = function () {
			loader.style.display = "none";
		};
	}
};
