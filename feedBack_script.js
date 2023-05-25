document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var feedbackText = document.getElementById('feedback-text').value;
  
    // Replace 'YOUR_EMAIL_ADDRESS' with the desired email address to receive the feedback
    var emailLink = 'mailto:saiabhishek.kosuri@gmail.com?subject=Feedback&body=' + encodeURIComponent(feedbackText);
  
    window.location.href = emailLink;
  });
  