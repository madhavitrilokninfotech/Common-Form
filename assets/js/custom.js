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


//***********  Custom Date & Time Picker JS  ***********//
$(function () {
    const $picker = $('#myDatePicker');
    let isAnimating = false;

    $picker.datetimepicker({
        format: "DD-MM-YYYY",
        // debug: true,
        icons: {
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right'
        }
    });

    // const pickerObj = $picker.data("DateTimePicker");
    // console.log(pickerObj);

    // pickerObj.show();

    // OPEN ANIMATION
    $picker.on('dp.show', function () {
        setTimeout(() => {
            $('.bootstrap-datetimepicker-widget table td, .bootstrap-datetimepicker-widget table td')
                .removeClass('scale-out-center')
                .addClass('scale-in-center');
        }, 10);
    });

    $picker.on('dp.update', function () {
        $('.bootstrap-datetimepicker-widget table td, .bootstrap-datetimepicker-widget table td')
            .removeClass('scale-out-center')
            .addClass('scale-in-center');
    });


    // CLOSE ANIMATION
    $picker.on('dp.hide', function (e) {
        if (isAnimating) return;

        e.preventDefault();
        isAnimating = true;
        const $cells = $('.bootstrap-datetimepicker-widget table td, .bootstrap-datetimepicker-widget table td');
        $cells
            .removeClass('scale-in-center')
            .addClass('scale-out-center');

        // Wait for animation to complete
        setTimeout(() => {
            $cells.removeClass('scale-out-center');
            isAnimating = false;
            // pickerObj.hide();
        }, 300);
    });

    // Animate when switching between date/month/year views
    let previousView = 'days';
    $picker.on('dp.update', function (e) {
        const widget = $('.bootstrap-datetimepicker-widget');
        let currentView = 'days';

        if (widget.find('.datepicker-months').is(':visible')) {
            currentView = 'months';
        } else if (widget.find('.datepicker-years').is(':visible')) {
            currentView = 'years';
        } else if (widget.find('.datepicker-decades').is(':visible')) {
            currentView = 'decades';
        }

        if (currentView !== previousView) {
            $('.bootstrap-datetimepicker-widget table td, .bootstrap-datetimepicker-widget table td')
                .removeClass('scale-out-center')
                .addClass('scale-in-center');
            previousView = currentView;
        }
    });

    //************* TimePicker **************/
    const $Timepicker = $('#myTimePicker');
    $Timepicker.datetimepicker({
        format: 'hh:mm A',
        // debug: true,
        icons: {
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down'
        }
    });

    // const TimepickerObj = $Timepicker.data("DateTimePicker");
    // console.log(TimepickerObj);

    // TimepickerObj.show();
});


//************* Date Range Picker JS **************/   
$(function () {
    const $rangePicker = $('#myDateRange');
    let isAnimating = false;
    let preventPickerHide = false;

    let startDate = null;
    let endDate = null;

    let selectingType = 'start'; // 'start' or 'end'

    $rangePicker.datetimepicker({
        format: "DD/MM/YYYY",
        // debug: true,
        useCurrent: false,
        ignoreReadonly: true,
        keepOpen: true,
        keepInvalid: true,
        icons: {
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right'
        }
    });

    const rangePickerObj = $rangePicker.data("DateTimePicker");
    // console.log(rangePickerObj);
    // rangePickerObj.show();

    // =========================
    // MOBILE KEYBOARD OFF
    // 
    // if (window.innerWidth < 768) {
    //     $rangePicker.on('touchstart', function () {
    //         // hide mobile keyboard
    //         document.activeElement.blur();
    //     });
    // }


    // =========================
    // UPDATE INPUT VALUE
    // =========================
    function updateInputValue() {

        // BOTH DATES
        if (startDate && endDate) {

            $rangePicker.val(
                startDate.format('DD/MM/YYYY') +
                ' - ' +
                endDate.format('DD/MM/YYYY')
            );
        }

        // ONLY START
        else if (startDate) {

            $rangePicker.val(
                startDate.format('DD/MM/YYYY')
            );
        }

        // EMPTY
        else {

            $rangePicker.val('');
        }
    }


    // =========================
    // INPUT CLICK
    // =========================
    $rangePicker.on('click', function (e) {
        e.preventDefault();
        const currentValue = $rangePicker.val();
        // if both dates exist
        if (startDate && endDate) {

            selectingType = 'start';
        }

        // only start exists
        else if (startDate && !endDate) {

            selectingType = 'end';
        }

        // nothing selected
        else {

            selectingType = 'start';
        }

        $rangePicker.val(currentValue);
        rangePickerObj.show();
        setTimeout(() => {

            updateRangeHeader();
            highlightRange();

        }, 10);
    });


    // =========================
    // PICKER SHOW
    // =========================
    $rangePicker.on('dp.show', function () {
        const $widget = $('.bootstrap-datetimepicker-widget');

        // remove old header
        $widget.find('.range-header').remove();


        // =========================
        // HEADER HTML
        // =========================
        const headerHTML = `
            <div class="range-header">
                <button 
                    class="range-date-box ${selectingType === 'start' ? 'active' : ''}" 
                    id="startDateBox" 
                    type="button"
                >

                    <div class="range-label">
                        Start
                    </div>

                    <div class="range-value" id="startDateDisplay">
                        ${startDate ? startDate.format('DD/MM/YYYY') : 'Please select'}
                    </div>

                </button>


                <button 
                    class="range-date-box ${selectingType === 'end' ? 'active' : ''}" 
                    id="endDateBox" 
                    type="button"
                >

                    <div class="range-label">
                        End
                    </div>

                    <div class="range-value" id="endDateDisplay">
                        ${endDate ? endDate.format('DD/MM/YYYY') : 'Please select'}
                    </div>

                </button>


                <button 
                    class="range-clear-btn" 
                    id="clearRangeBtn" 
                    type="button"
                >
                    <i class="fa fa-times"></i>
                </button>

            </div>
        `;

        $widget.find('.datepicker').prepend(headerHTML);


        // =========================
        // START CLICK
        // =========================


        // =========================
        // START CLICK
        // =========================
        $('#startDateBox').on('click', function (e) {

            e.stopPropagation();

            selectingType = 'start';

            updateRangeHeader();
            highlightRange();
        });


        // =========================
        // END CLICK
        // =========================

        $('#endDat  eBox').on('click', function (e) {

            e.stopPropagation();

            selectingType = 'end';

            updateRangeHeader();
            highlightRange();
        });


        // =========================
        // CLEAR BUTTON
        // =========================

        $('#clearRangeBtn').on('click', function (e) {

            e.preventDefault();
            e.stopPropagation();

            startDate = null;
            endDate = null;
            selectingType = 'start';

            updateInputValue();
            updateRangeHeader();
            highlightRange();
        });


        // =========================
        // ANIMATION
        // =========================

        setTimeout(() => {

            $('.bootstrap-datetimepicker-widget table td')
                .removeClass('scale-out-center')
                .addClass('scale-in-center');
            highlightRange();

        }, 10);
    });


    // =========================
    // DATE CHANGE
    // =========================
    $rangePicker.on('dp.change', function () {

        const widget = $('.bootstrap-datetimepicker-widget');

        const $activeDay = widget.find('td.day.active');

        if (!$activeDay.length) return;


        const selectedDay = parseInt($activeDay.text());

        const monthYear = widget.find('.picker-switch')
            .first()
            .text();

        const selectedDate = moment(
            `${selectedDay} ${monthYear}`,
            'D MMMM YYYY'
        );


        // =========================
        // START DATE
        // =========================

        if (selectingType === 'start') {

            startDate = selectedDate.clone();

            // swap if needed
            if (endDate && endDate.isBefore(startDate)) {

                const temp = startDate.clone();

                startDate = endDate.clone();
                endDate = temp;
            }

            selectingType = 'end';

            // keep picker open
            preventPickerHide = true;
            updateInputValue();
            updateRangeHeader();
            setTimeout(() => {

                highlightRange();

            }, 10);
        }


        // =========================
        // END DATE
        // =========================

        else {

            endDate = selectedDate.clone();
            // swap if needed
            if (startDate && endDate.isBefore(startDate)) {

                const temp = startDate.clone();

                startDate = endDate.clone();
                endDate = temp;
            }

            updateInputValue();
            updateRangeHeader();
            highlightRange();

            // close picker
            setTimeout(() => {
                // save final value
                const finalValue = startDate.format('DD/MM/YYYY') + ' - ' + endDate.format('DD/MM/YYYY');

                // hide picker
                rangePickerObj.hide();

                // Force restore value after hide
                setTimeout(() => {
                    $rangePicker.val(finalValue);
                }, 0);

            }, 250);
        }
    });


    // =========================
    // UPDATE HEADER
    // =========================
    function updateRangeHeader() {

        const $startBox = $('#startDateBox');
        const $endBox = $('#endDateBox');


        // START
        if (startDate) {

            $('#startDateDisplay')
                .text(startDate.format('DD/MM/YYYY'))
                .css('color', '#000');
        }

        else {

            $('#startDateDisplay')
                .text('Please select')
                .css('color', '#999');
        }

        // END
        if (endDate) {

            $('#endDateDisplay')
                .text(endDate.format('DD/MM/YYYY'))
                .css('color', '#000');
        }

        else {

            $('#endDateDisplay')
                .text('Please select')
                .css('color', '#999');
        }


        // ACTIVE STATE
        $startBox.toggleClass(
            'active',
            selectingType === 'start'
        );

        $endBox.toggleClass(
            'active',
            selectingType === 'end'
        );
    }


    // =========================
    // RANGE HIGHLIGHT
    // =========================
    function highlightRange() {

        $('.bootstrap-datetimepicker-widget table td.day')
            .removeClass(
                'range-start range-end range-between range-between-first range-between-last'
            );


        if (!startDate && !endDate) return;

        $('.bootstrap-datetimepicker-widget table td.day').each(function () {

            let $td = $(this);
            const day = parseInt($td.text());
            const widget = $('.bootstrap-datetimepicker-widget');

            const monthYear = widget.find('.picker-switch')
                .first()
                .text();

            const visibleMonth = moment(monthYear, 'MMMM YYYY');
            let currentDate;


            // PREVIOUS MONTH
            if ($td.hasClass('old')) {
                currentDate = visibleMonth
                    .clone()
                    .subtract(1, 'month')
                    .date(day);
            }

            // NEXT MONTH
            else if ($td.hasClass('new')) {
                currentDate = visibleMonth
                    .clone()
                    .add(1, 'month')
                    .date(day);
            }

            // CURRENT MONTH
            else {
                currentDate = visibleMonth
                    .clone()
                    .date(day);
            }


            // START DATE
            if (
                startDate &&
                currentDate.isSame(startDate, 'day')
            ) {

                $td.addClass('range-start');
            }


            // END DATE
            if (
                endDate &&
                currentDate.isSame(endDate, 'day')
            ) {

                $td.addClass('range-end');
            }


            // BETWEEN RANGE
            if (
                startDate &&
                endDate &&
                currentDate.isAfter(startDate, 'day') &&
                currentDate.isBefore(endDate, 'day')
            ) {

                $td.addClass('range-between');
            }
        });


        // FIRST BETWEEN
        $('.range-between')
            .first()
            .addClass('range-between-first');


        // LAST BETWEEN
        $('.range-between')
            .last()
            .addClass('range-between-last');
    }


    // =========================
    // UPDATE
    // =========================
    $rangePicker.on('dp.update', function () {

        setTimeout(() => {
            highlightRange();

        }, 50);
    });


    // =========================
    // HIDE
    // =========================
    $rangePicker.on('dp.hide', function (e) {
        // keep open after start
        if (preventPickerHide) {

            e.preventDefault();
            preventPickerHide = false;

            // Immediately restore value
            updateInputValue();
        }

        if (isAnimating) return;
        isAnimating = true;

        const $widget = $('.bootstrap-datetimepicker-widget.dropdown-menu');

        const $cells = $('.bootstrap-datetimepicker-widget table td');


        $widget
            .removeClass('scale-in-center')
            .addClass('scale-out-center');

        $cells
            .removeClass('scale-in-center')
            .addClass('scale-out-center');

        setTimeout(() => {
            isAnimating = false;
            updateInputValue();
        }, 200);
    });
});



//************* Profile Image Upload JQuery **************/

const $profileInput = $("#profileInput");
const $profilePreview = $("#profilePreview");
const defaultImage =
    "./assets/images/profile-avtar-placeholder.png";

// Default Placeholder
$profilePreview.css(
    "background-image",
    `url(${defaultImage})`
);

// Open Upload
$profilePreview.on("click", function () {
    $profileInput.click();
});

// Image Preview
$profileInput.on("change", function () {
    const file = this.files[0];

    // If image selected
    if (file) {

        const reader = new FileReader();
        reader.onload = function (e) {
            $profilePreview.css(
                "background-image",
                `url(${e.target.result})`
            );

        };

        reader.readAsDataURL(file);
    }

    // If user cancels selection
    else {
        $profilePreview.css(
            "background-image",
            `url(${defaultImage})`
        );

    }

});


//************* Profile Upload or Remove Image JQuery **************/
const $profileInput1 = $("#profileInput1");
const $profilePreview1 = $("#profilePreview1");
const $uploadBtn1 = $(".profile-upload-btn");
const $removeBtn1 = $(".profile-remove-btn");

const defaultImage1 = "./assets/images/profile-avtar-placeholder.png";

// ================= Default Image =================
$profilePreview1.css(
    "background-image",
    `url(${defaultImage1})`
);

// Remove button disabled by default
$removeBtn1.prop("disabled", true).addClass("disabled");

// ================= Upload Click =================
$uploadBtn1.on("click", function () {
    $profileInput1.click();
});

// ================= Preview Image =================
$profileInput1.on("change", function () {

    const file = this.files[0];

    // If image selected
    if (file) {

        const reader = new FileReader();

        reader.onload = function (e) {

            $profilePreview1.css(
                "background-image",
                `url(${e.target.result})`
            );

            // Enable remove button
            $removeBtn1.prop("disabled", false).removeClass("disabled");
        };

        reader.readAsDataURL(file);
    }

});

// ================= Remove Image =================
$removeBtn1.on("click", function () {

    // Reset image
    $profilePreview1.css(
        "background-image",
        `url(${defaultImage1})`
    );

    // Reset input
    $profileInput1.val("");

    // Disable remove button again
    $removeBtn1.prop("disabled", true).addClass("disabled");

});



//************* Single Select Custom Dropdown **************/
$(document).ready(function () {
    // Check if ID exists
    if ($("#SelectDropdown").length) {
        // Toggle Dropdown
        $(document).on("click", "#SelectDropdown .custom-select-box", function (e) {
            e.stopPropagation();

            const $parent = $(this).closest("#SelectDropdown");

            $("#SelectDropdown")
                .not($parent)
                .removeClass("active")
                .find(".custom-dropdown")
                .slideUp(300);

            $parent.toggleClass("active");
            $parent.find(".custom-dropdown").stop(true, true).slideToggle(300);

        });

        // Select Item
        $(document).on("click", "#SelectDropdown .dropdown-item", function (e) {
            e.stopPropagation();

            const selectedText = $(this).text();
            const $parent = $(this).closest("#SelectDropdown");
            const $selectedText = $parent.find(".selected-text");

            // Remove old selected class
            $parent.find(".dropdown-item").removeClass("selected");

            // Add active class to selected item
            $(this).addClass("selected");

            // Set selected text
            $selectedText
                .text(selectedText)
                .addClass("selected");

            // Close dropdown
            $parent.removeClass("active");
            $parent.find(".custom-dropdown").slideUp(300);
        });

        // Outside Click
        $(document).on("click", function (e) {
            if (!$(e.target).closest("#SelectDropdown").length) {

                $("#SelectDropdown")
                    .removeClass("active")
                    .find(".custom-dropdown")
                    .slideUp(300);
            }
        });
    };
});


//************* Single Select Custom Floating Dropdown **************/
const dropdownWrap = document.getElementById('FloatingDropdownWrap');

if (dropdownWrap) {
    const selectBox = dropdownWrap.querySelector('#FloatingDropdown');
    const dropdownMenu = dropdownWrap.querySelector('#DropdownOptions');
    const selectedValue = dropdownWrap.querySelector('#selectedValue');

    // Toggle dropdown
    selectBox.addEventListener('click', function () {
        selectBox.classList.toggle('active');
        dropdownMenu.classList.toggle('show');
    });

    // Select multiple options dynamically
    dropdownMenu.addEventListener('click', function (event) {
        const item = event.target.closest('.optionitem');

        if (item) {
            // Remove selected class from all items
            const allItems = dropdownMenu.querySelectorAll('.optionitem');
            allItems.forEach(function (opt) {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked item
            item.classList.add('selected');

            // Update selected text
            selectedValue.textContent = item.getAttribute('data-value');

            // Close dropdown
            selectBox.classList.remove('active');
            dropdownMenu.classList.remove('show');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('#FloatingDropdownWrap')) {
            selectBox.classList.remove('active');
            dropdownMenu.classList.remove('show');
        }
    });
}   