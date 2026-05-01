//***********  For Multi Select Dropdown using Select2 library ***********//

$(document).ready(function () {
    $("#customSelect").select2({
        placeholder: "Choose select options...",
        allowClear: true,
        closeOnSelect: false,
        width: "100%",
        minimumResultsForSearch: Infinity,
    });
    function updateMoreBadge() {
        let selected = $("#customSelect").select2("data");
        let maxVisible = 3;

        let container = $("#customSelect")
            .next(".select2-container")
            .find(".select2-selection__rendered");

        container.find(".select2-selection__choice").show();
        container.find(".more-badge").remove();

        if (selected.length > maxVisible) {
            let extraCount = selected.length - maxVisible;

            container.find(".select2-selection__choice").each(function (index) {
                if (index >= maxVisible) {
                    $(this).hide(); // hide extra items
                }
            });

            container.append(
                `<li class="select2-selection__choice more-badge">+${extraCount} more</li>`,
            );
        }
    }

    $("#customSelect").on("change", function () {
        updateMoreBadge();
    });
});



//***********  Password Toggle ***********//

$(document).on("click", ".toggle-password", function () {
    let PasswordInputID = $(this).data("target");
    let PasswordInput = $("#" + PasswordInputID);
    let icon = $(this).find("i");

    if (PasswordInput.attr("type") === "password") {
        PasswordInput.attr("type", "text");
        icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
        PasswordInput.attr("type", "password");
        icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
});
//  Password Validation Function
function validatePassword() {
    let password = $("#password").val().trim();
    let confirmPassword = $("#confirmPassword").val().trim();
    let isValid = true;

    // Password required
    if (password === "") {
        $("#passwordError").text("Password is required").show();
        $("#password").addClass("error-border");
        isValid = false;
    } else {
        $("#passwordError").text("").hide();
        $("#password").removeClass("error-border");
    }

    // Confirm password required
    if (confirmPassword === "") {
        $("#confirmPasswordError").text("Confirm password is required").show();
        $("#confirmPassword").addClass("error-border");
        isValid = false;
    } else {
        $("#confirmPasswordError").text("").hide();
        $("#confirmPassword").removeClass("error-border");
    }

    // Password match check
    if (
        password !== "" &&
        confirmPassword !== "" &&
        password !== confirmPassword
    ) {
        $("#confirmPasswordError").text("Passwords do not match").show();
        $("#confirmPassword").addClass("error-border");
        isValid = false;
    }

    return isValid;
}
// Form Submit Validation
$("#RegistrationForm").on("submit", function (e) {
    if (!validatePassword()) {
        e.preventDefault();
    }
});



//***********  Phone Number - Format like AU number ***********//

$("#phoneNumber").on("input", function () {
    let cursorPos = this.selectionStart; // keep cursor position
    let oldValue = $(this).val();

    let digits = oldValue.replace(/\D/g, "").substring(0, 10); // max 10 digits
    let formatted = "";

    // Format: XXXX XXX XXX
    if (digits.length <= 3) {
        formatted = digits;
    } else if (digits.length <= 6) {
        formatted = digits.slice(0, 3) + " " + digits.slice(3);
    } else if (digits.length === 9) {
        // 9 digit → XXX XXX XXX
        formatted =
            digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6);
    } else {
        // 10 digit →  XXXX XXX XXX
        formatted =
            digits.slice(0, 4) + " " + digits.slice(4, 7) + " " + digits.slice(7);
    }

    $(this).val(formatted);
});

// Validation
$("#phoneNumber").on("blur", function () {
    let value = $(this).val().replace(/\s/g, "");

    if (!(value.length === 9 || value.length === 10)) {
        $("#phoneError").text("Required valid number");
    } else {
        $("#phoneError").text("");
    }
});



//***********  Upload document ***********//

document.addEventListener('DOMContentLoaded', function () {

    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');

    // =========================
    // CLICK UPLOAD
    // =========================
    uploadBox.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function () {
        handleFiles(this.files);
        fileInput.value = '';
    });

    // =========================
    // DRAG & DROP
    // =========================
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        uploadBox.addEventListener(event, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    ['dragenter', 'dragover'].forEach(event => {
        uploadBox.addEventListener(event, () => {
            uploadBox.classList.add('drag-active');
        });
    });

    ['dragleave', 'drop'].forEach(event => {
        uploadBox.addEventListener(event, () => {
            uploadBox.classList.remove('drag-active');
        });
    });

    uploadBox.addEventListener('drop', function (e) {
        handleFiles(e.dataTransfer.files);
    });

    // =========================
    // HANDLE MULTIPLE FILES
    // =========================
    function handleFiles(files) {
        Array.from(files).forEach(file => processFile(file));
    }

    // =========================
    // PROCESS FILE
    // =========================
    function processFile(file) {

        const ext = file.name.split('.').pop().toLowerCase();
        const size = formatFileSize(file.size);

        const allowed = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
        if (!allowed.includes(ext)) {
            alert(file.name + ' not supported');
            return;
        }

        // IMAGE
        if (['jpg', 'jpeg', 'png'].includes(ext)) {
            const reader = new FileReader();

            reader.onload = function (e) {
                renderFile(
                    `<img src="${e.target.result}" class="file-image-preview">`,
                    file.name,
                    size,
                    'image'
                );
            };

            reader.readAsDataURL(file);
        }
        // DOC / PDF
        else {
            renderFile(
                `<img src="${getFileIcon(ext)}" class="file-icon">`,
                file.name,
                size,
                'doc'
            );
        }
    }

    // =========================
    // RENDER UI
    // =========================
    function renderFile(content, name, size, type) {

        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');

        let html = '';

        // WHEN ATTACHED IMAGE
        if (type === 'image') {
            html = `
                <div class="file-top">
                    <div class="file-attched-img">
                        ${content}
                        <div class="remove-file">
                            <img src="assets/images/doc-remove.png">
                        </div>
                    </div>

                    <div class="wrp-file-deatils">
                        <div class="file-name">${name}</div>
                        <div class="file-size">${size}</div>
                    </div>
                </div>
            `;
        }

        // WHEN ATTACHED DOC / PDF 
        else {
            html = `
                <div class="file-top">
                    <div class="file-doc-icon">
                        ${content}
                        <div class="remove-file">
                            <img src="assets/images/doc-remove.png">
                        </div>
                    </div>

                    <div class="wrp-file-deatils">
                        <div class="file-name">${name}</div>
                        <div class="file-size">${size}</div>
                    </div>
                </div>
            `;
        }

        fileItem.innerHTML = `
        ${html}
            <div class="progress">
                <div class="progress-bar" style="width:100%"></div>
            </div>
        `;

        filePreview.appendChild(fileItem);
    }

    // =========================
    // REMOVE FILE
    // =========================
    document.addEventListener('click', function (e) {
        if (e.target.closest('.remove-file')) {
            e.target.closest('.file-item').remove();
        }
    });

    // =========================
    // FILE ICONS
    // =========================
    function getFileIcon(ext) {
        if (ext === 'pdf') return './assets/images/pdf-icon.png';
        if (ext === 'doc' || ext === 'docx') return './assets/images/doc-icon.png';
        return 'https://cdn-icons-png.flaticon.com/512/337/337929.png';
    }

    // =========================
    // FILE SIZE FORMAT
    // =========================
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

});



//***********  Submit Button loader ***********//

document.getElementById('RegistrationForm').addEventListener('submit', function (e) {

    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('formMsg');

    // Loader start
    btn.classList.add('loading');
    btn.disabled = true;
    msg.classList.remove('show');
    msg.textContent = '';

    // Simulate API 
    setTimeout(() => {

        // Stop loader
        btn.classList.remove('loading');
        btn.disabled = false;

        // Show success message
        msg.textContent = 'Submitted successfully!';
        msg.classList.add('show');

        setTimeout(() => {
            msg.classList.remove('show');
            msg.textContent = '';
        }, 4000);
    }, 2000);

});


//***********  Date Picker using Flatpickr library ***********//
flatpickr("#datepicker", {
    dateFormat: "d/m/Y",
    disableMobile: true,
});


//***********  Input Range Single Slider ***********//

const sliderEl = document.querySelector("#range")
const sliderValue = document.querySelector(".value")

sliderEl.addEventListener("input", (event) => {
    const tempSliderValue = event.target.value;

    sliderValue.textContent = tempSliderValue;

    const progress = (tempSliderValue / sliderEl.max) * 100;

    sliderEl.style.background = `linear-gradient(to right, #C67C4E ${progress}%, #ccc ${progress}%)`;
})


//***********  Input Range Double Slider ***********//
document.addEventListener('DOMContentLoaded', function () {
    const MIN = 0, MAX = 500, GAP = 1;
    const rMin = document.getElementById('range_min');
    const rMax = document.getElementById('range_max');
    const iMin = document.getElementById('input_min');
    const iMax = document.getElementById('input_max');

    function update() {
        let lo = parseInt(rMin.value), hi = parseInt(rMax.value);
        if (lo > hi - GAP) { rMin.value = lo = hi - GAP; }
        if (hi < lo + GAP) { rMax.value = hi = lo + GAP; }
        const pct = v => Math.min(100, Math.max(0, ((v - MIN) / (MAX - MIN)) * 100));
        document.getElementById('fill').style.left = pct(lo) + '%';
        document.getElementById('fill').style.width = (pct(hi) - pct(lo)) + '%';
        iMin.value = lo;
        iMax.value = hi;
    }

    // Edit Value in Input  
    iMin.addEventListener('input', () => {
        rMin.value = Math.min(Math.max(parseInt(iMin.value) || MIN, MIN), parseInt(rMax.value) - GAP);
        update();
    });

    iMax.addEventListener('input', () => {
        rMax.value = Math.max(Math.min(parseInt(iMax.value) || MAX, MAX), parseInt(rMin.value) + GAP);
        update();
    });

    rMin.addEventListener('input', update);
    rMax.addEventListener('input', update);
    update();
    // document.querySelector('#val_min .marktext').textContent = lo;
    // document.querySelector('#val_max .marktext').textContent = hi;

});



//***********  Toggle Input Switch > Custom  ***********//

const toggleWrapper = document.querySelector('.switch-toggle-wrap');
const radios = toggleWrapper.querySelectorAll('input[name="plan"]');

// Get selected value
function getSelectedPlan() {
    return toggleWrapper.querySelector('input[name="plan"]:checked').value;
}

// Listen to changes
radios.forEach(radio => {
    radio.addEventListener('change', function () {
        console.log('Selected:', this.value);
    });
});