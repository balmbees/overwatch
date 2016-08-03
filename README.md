# OVERWATCH

Topology Based Monitoring Tool

## What's this for?

At Vingle, we wanted really simple monitoring tool that shows big picture of our system
and at the same time shows the really simple status of each service components.
we originally thought that would be really helpful to

1. Monitor the major service outage. (detailed performance is not really matter at this point)
2. Explain the service architecture, the big picture to newbies
3. When some of our service components goes wrong, know which service will get effected
  - ex) RDS down
      - API (&#128308;)
      - iOS App (&#128308;)
      - Android App (&#128308;)
      - Web App (&#127765;)
      - User Tracking (&#128309;)
4. Put detailed monitoring / tracking tool links in one place (Sentry, NewRelic...)

## Concepts

## Road Map

1. Build basic Component / Service Monitoring Tool
  - Support AWS CloudWatch based monitoring
  - Support Slack Notification Adapter

this project used skeleton of https://github.com/GianlucaGuarini/es6-project-starter-kit,
and inspired by great monitoring tool project such as https://github.com/arachnys/cabot about status / alert structure,
and https://github.com/NagiosEnterprises/nagioscore for some concepts
