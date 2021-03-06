
$(document).ready(function () {
    $(".filters").hide()

    $.get("/api/auth").then(function (res) {
        $(".results-wrapper").append("<img src='/assets/loading.gif' />")
        if (res) {
            window.location.replace("/search")
        } else {
            $(".results-wrapper").empty()
            $(".results-wrapper").append("Finding the newest postings...<br/><img src='/assets/loading.gif' />")
            $.get("/api/publicSearch?keywords=", function (res) {
                $(".results-wrapper").empty()
                if (res.length == 0) {
                    $(".results-wrapper").append("<br/><strong>404 Job not found!<br/>Have you tried ammending your search?</strong>")
                }
                for (i = 0; i < res.length; i++) {
                    var result = createResult(i, res[i], false)
                    $(".results-wrapper").append(result)
                    $("#info" + i).css("display", "none")
                    $("#description" + i).show()
                }
                $('.result-description *').removeAttr('style');
                console.log(res)
            })
        }
    })

    $("#register").on("click", function (e) {
        e.preventDefault()
        var email = $("#registerEmail").val()
        var password = $("#registerPassword").val()
        var confirmPassword = $("#registerConfirmPassword").val()
        if (email.indexOf(".com") != -1 && email.indexOf("@") != -1) {
            if (password == confirmPassword) {
                $.post("/api/register", { email: email, password: password }).then(function (res) {
                    if (res) {
                        $.post("/api/login", { email: email, password: password }).then(function (res) {
                            if (res) {
                                window.location.replace("/search")
                            }
                        })
                    }
                })
            } else {
                alert("The passwords you entered do not match. Please try again.")
            }
        } else {
            alert("The E-mail adress you entered is not valid. Please try again.")
        }
    })

    $("#logIn").on("click", function (e) {
        e.preventDefault()
        var email = $("#logInEmail").val()
        var password = $("#logInPassword").val()
        // $.post("/api/login", { email: email, password: password }).then(function (res) {
        //     if (res) {
        //         window.location.replace("/search")
        //     }
        // })}

        $.ajax({
            method: "POST",
            url: '/api/login',
            data: { email: email, password: password },
            xhrFields: {
                withCredentials: true
            },
            success: function (res) {
                window.location.replace("/search")
            }
        });
    }
    )

    $("#logInButton").on("click", function (e) {
        e.preventDefault()
        $('#logInModal').modal('toggle');
    })

    $("#registerButton").on("click", function (e) {
        e.preventDefault()
        $('#registerModal').modal('toggle');
    })

    $(".tab").mouseover(function () {
        $(this).css("background-color", "rgb(60, 60, 60)")
    })

    $(".tab").mouseleave(function () {
        $(this).css("background-color", "rgb(30, 30, 30)")
    })

    $("#search").on("click", function (e) {
        e.preventDefault()
        $(".results-wrapper").empty()
        $(".results-wrapper").append("<img src='/assets/loading.gif' />")
        var val = getSearchString()//$("#searchField").val()
        $.get("/api/publicSearch?" + val, function (res) {
            $(".results-wrapper").empty()
            if (res.length == 0) {
                $(".results-wrapper").append("<br/><strong>404 Job not found!<br/>Have you tried ammending your search?</strong>")
            }
            for (i = 0; i < res.length; i++) {
                var result = createResult(i, res[i], false)
                $(".results-wrapper").append(result)
                $("#info" + i).css("display", "none")
                $("#description" + i).show()
            }
            $('.result-description *').removeAttr('style');
            console.log(res)
        })
    })

    $(".filter-expand").on("click", function (e) {
        e.preventDefault()
        var toggle = ($(this).attr("toggle"))
        if (toggle == "true") {
            $(".filters").hide()
            $(this).attr("toggle", "false")
            $(".filter-expand").html("<button class='btn btn-outline-light arrow-down'>" +
                "Filters" +
                "</button>")
        } else {
            $(".filters").show()
            $(this).attr("toggle", "true")
            $(".filter-expand").html("<button class='btn btn-outline-light arrow-down'>" +
                "<img src='/assets/chevron-up.png' />" +
                "</button>")
        }
    })

    $(document.body).on('click', '.info', function (e) {
        e.preventDefault()
        var id = $(this).attr("id").replace(/\D/g, '');
        var toggle = $(this).attr("toggle")
        $("#content" + id).css("max-height", "320px")
        $("#expand" + id).html("<button class='btn btn-outline-secondary arrow-down'>" +
            "<img src='/assets/chevron-down.png' />" +
            "</button>")
        if ($(window).scrollTop() > $("#result" + id).offset().top) {
            $('html, body').animate({
                scrollTop: $("#result" + id).offset().top
            }, 200);
        }
        $("#expand" + id).attr("toggle", "true")
        if (toggle == "true") {
            $(this).html("Description")
            $("#description" + id).hide()
            $("#info" + id).css("display", "flex")
            $(this).attr("toggle", "false")
        } else {
            $(this).html("Information")
            $("#info" + id).css("display", "none")
            $("#description" + id).show()
            $(this).attr("toggle", "true")
        }
    })

    $(document.body).on('click', '.apply', function (e) {
        e.preventDefault()
        var data = $(this).attr("data")
        window.open(data)
    })

    $(document.body).on('click', '.save', function (e) {
        e.preventDefault()
        $('#logInModal').modal('toggle');
    })

    $(document.body).on('click', '.jobPage', function (e) {
        e.preventDefault()
        var href = $(this).attr("href")
        window.open(href)
    })

    $(document.body).on('click', '.businessPage', function (e) {
        e.preventDefault()
        var href = $(this).attr("href")
        window.open(href)
    })

    $(document.body).on('click', '.result-expand', function (e) {
        e.preventDefault()
        var id = $(this).attr("id").replace(/\D/g, '');
        var toggle = $(this).attr("toggle")
        console.log(toggle)
        if (toggle == "true") {
            $("#content" + id).css("max-height", "100%")
            $("#content" + id).css("height", "auto")
            $(this).html("<button class='btn btn-outline-secondary arrow-down'>" +
                "<img src='/assets/chevron-up.png' />" +
                "</button>")
            $(this).attr("toggle", "false")
        } else {
            $("#content" + id).css("max-height", "320px")
            // $("#content" + id).css("height", "auto")
            $(this).html("<button class='btn btn-outline-secondary arrow-down'>" +
                "<img src='/assets/chevron-down.png' />" +
                "</button>")
            if ($(window).scrollTop() > $("#result" + id).offset().top) {
                $('html, body').animate({
                    scrollTop: $("#result" + id).offset().top
                }, 200);
            }
            $(this).attr("toggle", "true")
        }
    })
    $('#telecommute').on("click", function () {
        $("#location").val("")
        $("#location").prop('disabled', ($('#telecommute').is(":checked")))
    })
})

//------------------------------------------------------------------------------

function createResult(id, data, saved) {
    if (data.perks === null || data.perks == "") {
        data.perks = "[None Listed]"
    }
    if (data.telecommuting) {
        data.telecommuting = "true"
    } else {
        data.telecommuting = "false"
    }
    if (data.relocation_assistance) {
        data.relocation_assistance = "true"
    } else {
        data.relocation_assistance = "false"
    }
    if (!data.company_url) {
        company = "404<br/>Company Logo Not Found"
    }
    if (!data.company_name) {
        data.company_name = "[Not Listed]"
    }
    if (!data.category_name) {
        data.category_name = "[Not Listed]"
    }
    if (!data.type_name) {
        data.type_name = "[Not Listed]"
    }
    if (data.company_url) {
        company = "<img src='https://logo.clearbit.com/" + data.company_url + "' class='result-logo-img' onerror='replaceLogo(this)'/>"
    }
    var string =
        "<div class='result' id='result" + id + "'>" +
        "<div class='result-header'><strong>" + data.title + "</strong></div>" +
        "<div class='result-content' id='content" + id + "'>" +
        "<div class='result-description' id='description" + id + "'>" + data.description + "</div>" +
        "<div class='result-info' id='info" + id + "'>" +
        "<div class='result-company-logo'>" + company + "</div>" +
        "<div class='result-company-name'><strong>Company Name:</strong><br/><a class='businessPage' href='" + data.company_url + "'>" + data.company_name + "</a></div>" +
        "<div class='result-post-date'><strong>Date Posted:</strong><br/>" + data.post_date + "</div>" +
        "<div class='result-category-name'><strong>Category:</strong><br/>" + data.category_name + "</div>" +
        "<div class='result-perks'><strong>Perks:</strong><br/>" + data.perks + "</div>" +
        "<div class='result-type-name'><strong>Hours:</strong><br/>" + data.type_name + "</div>" +
        "<div class='result-relocation-assistance'><strong>Relocation Assistance:</strong><br/>" + data.relocation_assistance + "</div>" +
        "<div class='result-telecommuting'><strong>Telecommute:</strong><br/>" + data.telecommuting + "</div>" +
        "<div class='result-url'><strong>Job Page:</strong><br/><a class='jobPage' href='" + data.url + "'>Click Here</a></div>" +
        "</div>" +
        "</div>" +
        "<div class='result-expand' id='expand" + id + "' toggle='true'>" +
        "<button class='btn btn-outline-secondary arrow-down'>" +
        "<img src='/assets/chevron-down.png' />" +
        "</button>" +
        "</div>"
    if (saved) {
        return (string +
            "<div class='button-group'>" +
            "<button type='button' class='btn btn-outline-light button info' toggle='true' id='info" + id + "'>Information</button>" +
            "<button type='button' class='btn btn-outline-danger button delete'>Delete</button>" +
            "<button type='button' class='btn btn-outline-primary button apply' data='" + data.apply_url + "'>Apply</button>" +
            "</div>" +
            "</div>"
        )
    } else {
        return (string +
            "<div class='button-group'>" +
            "<button type='button' class='btn btn-outline-light button info' toggle='true' id='info" + id + "'>Information</button>" +
            "<button type='button' class='btn btn-outline-success button save' data='" + id + "'>Save</button>" +
            "<button type='button' class='btn btn-outline-primary button apply' data='" + data.apply_url + "'>Apply</button>" +
            "</div>" +
            "</div>"
        )
    }
}
function replaceLogo(ele) {
    $(ele).parent().append("404<br/>Company Logo Not Found")
    $(ele.remove())
}


function getSearchString() {
    var q = $("#searchField").val()
    var cat = $("#category-select").val()
    var type = $("#type-select").val()
    var tele = ($('#telecommute').is(":checked"))
    var sort = $("#sort-select").val()
    var loc = $("#location").val()

    if (cat == "Choose...") {
        cat = ""
    } else {
        cat = "&category=" + cat
    }
    if (type == "Choose...") {
        type = ""
    } else {
        type = "&type=" + type
    }
    if (sort == "Choose...") {
        sort = ""
    } else {
        if (sort == "1") {
            sort = "&sort=date-posted-asc"
        } else {
            sort = ""
        }
    }
    if (tele) {
        tele = "&telecommuting=1"
    } else {
        tele = ""
        if (!loc == "") {
            loc = "&location=" + loc
        }
    }
    console.log("keywords=" + q + cat + type + sort + tele + loc)
    return ("keywords=" + q + cat + type + sort + tele + loc)
}