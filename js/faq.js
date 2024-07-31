$(function () {
  $("#accordion").accordion({
    header: ".accordion-header",
  });

  // Expand/Collapse all
  $(".accordion-expand-collapse a").click(function () {
    $("#accordion .ui-accordion-header:not(.ui-state-active)").next().slideToggle();
    $(this).text($(this).text() == "Expand all" ? "Collapse all" : "Expand all");
    $(this).toggleClass("collapse");
    return false;
  });
});
