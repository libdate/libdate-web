export default library => `
{
    library(name: "${library}", source: github) {
      name
      current_version
      source
      description
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