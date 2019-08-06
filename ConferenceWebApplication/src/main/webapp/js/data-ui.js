const showRegisterSpeaker = async () => {
    const user = await auth0.getUser();
    $("#speakerName").val(user.name);
    $("#registerSpeakerModal").modal("show");
}

const updateSpeakers = async (speakers) => {
    const user = await auth0.getUser();

    var tableBody = $('#current-speakers > tbody');
    tableBody.empty();
    speakers.forEach(speaker => {
        var statusElement = null;
        var acceptButton = $(`<button class="btn btn-primary">
                                <i class="fa fa-user-check"></i>
                              </button>`);
        if (speaker.accepted) {
            statusElement = $(`<span class="badge badge-success">
                                  <i class="fa fa-check-double"></i> Accepted!
                               </span>`);
            acceptButton.attr("disabled", true);
        } else {
            statusElement = $(`<span class="badge badge-secondary">
                                  <i class="fa fa-question"></i> Still pending
                               </span>`);
            acceptButton.click(e => acceptSpeaker(speaker.id));
        }
        var nameElement = `${speaker.name}`;
        if (speaker.identity === user.sub) {
            $("#show-register-speaker").attr("disabled", true);
            nameElement += ` <span class="badge badge-pill badge-info">You</span>`;
        }
        tableBody.append("<tr>")
            .append(`<th scope="row">${speaker.id}</th>`)
            .append(`<td><i class="fa fa-user-tie"></i> ${nameElement}</td>`)
            .append(`<td>${speaker.organization}</td>`)
            .append($(`<td>`).append(statusElement))
            .append($(`<td>`).append(acceptButton));
    });
};

const updateSessions = async (sessions, registered) => {
    var tableBody = $('#current-sessions > tbody');
    tableBody.empty();
    sessions.forEach(session => {
        var attendButton = $(`<button class="btn btn-primary">
                                <i class="fa fa-calendar-plus"></i>
                              </button>`);
        var summary = session.title;
        if (registered.indexOf(session.id) > -1) {
            attendButton.attr("disabled", true);
            summary += ` <span class="badge badge-success">
                            I'm attending
                            <i class="fa fa-check-circle"></i>
                        </span>`;
        }
        var deleteButton = $(`<button class="btn btn-danger">
                                <i class="fa fa-minus-circle"></i>
                              </button>`);
        attendButton.click((e) => attendSession(session.id));
        deleteButton.click((e) => deleteSession(session.id));
        tableBody.append("<tr>")
            .append(`<th scope="row">${session.id}</th>`)
            .append(`<td>${summary}</td>`)
            .append(`<td>${session.venue}</td>`)
            .append(`<td>${session.date}</td>`)
            .append(`<td>${session.duration}</td>`)
            .append($("<td>")
                .append($(`<div class="btn-group" role="group"></div>`)
                    .append(attendButton)
                    .append(deleteButton)));
    });
};

const showMessage = async (type, message) => {
    var newAlert = $(`
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `);
    $("#alerts").append(newAlert);
    newAlert.alert();
};