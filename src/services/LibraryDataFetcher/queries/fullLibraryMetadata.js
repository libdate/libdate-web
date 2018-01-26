export default library => `
{
    library(name: "${library}", token: "$token") {
      name
      current_version
      source
      description
      githubUrl
      releases {
        date
        version
        description,
        age_days
        age_text
      }
    },
  }
`;