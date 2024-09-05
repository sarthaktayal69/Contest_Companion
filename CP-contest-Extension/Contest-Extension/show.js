//DO NOT MODIFY THIS FILE
d3.csv("https://raw.githubusercontent.com/vanessaaleung/A-LeetCode-A-Day/master/leetcode.csv", function(d) {
  return {
  	no : +d.No,
    id : +d.ID,
    title : d.Title,
    url : d.Link,
    difficulty : d.Difficulty
  };
}).then(function(data) {
  var random = d3.randomInt(100)()
  var container = d3.select("div")
    .data(data.filter(function(d){ return d.no === random}))

  var title = container.select(".title")
                .append("p")
                .text(function(d){return d.id +" "+ ". " + d.title})
    

  var difficulty = container.select(".diff")
  .text(function(d) { return d.difficulty; })
  .style("color", function(d) {
      if (d.difficulty === "Easy") {
          return "#00b8a3";
      } else if (d.difficulty === "Medium") {
          return "#ffc01e";
      } else if (d.difficulty === "Hard") {
          return "#ff375f";
      } else {
          return "black"; // default color if difficulty doesn't match any of the values
      }
  })
  .style("font-size", "20px"); 

  var button = container.select("#gotoquestion")
                  .on("click", function(d){
                    window.open(d.url)
                  })
});