stages =
{
  stages: [
    {
      title: 'pilot proposal',
      steps: [
        {
          title: 'gather',
          route: '/ideas/gather'
        },
        {
          title: 'rate',
          route: '/ideas/rate'
        },
        {
          title: 'filter',
          route: '/ideas/filter'
        }
      ]
    },
    {
      title: 'technical implementation',
      steps: [
        {
          title: 'gather',
          route: '/methodology/gather'
        },
        {
          title: 'rate',
          route: '/methodology/rate'
        },
        {
          title: 'filter',
          route: '/methodology/filter'
        }
      ]
    },
    {
      title: 'collision rules',
      steps: [
        {
          title: 'gather',
          route: '/milestones/gather'
        },
        {
          title: 'rate',
          route: '/milestones/rate'
        },
        {
          title: 'filter',
          route: '/milestones/filter'
        }
      ]
    }
  ],
  metadata : {
    total : 9
  }
}

module.exports = stages
