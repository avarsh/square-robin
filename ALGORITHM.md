# The Scheduling Algorithm

## Objectives

The main objectives of the scheduling algorithm used by the application
to schedule projects and tasks are as follows:

1. To present an achievable goal in terms of workload.
    - This means it is not feasible to simply list all pending tasks, as it is likely to not be possible to complete all tasks within a single day.
    
2. To suggest tasks such that they may reasonably be completed.
    - Hence, larger tasks need to be suggested more frequently as they require more sessions to complete.

Some of these objectives may not always be possible to achieve. For example, when workloads are high but time is low, it is not possible to suggest what may be seen as an achievable goal. Therefore, objective 2 must take priority. 

## Design Proposals

### Mechanic: Urgency

The most basic implementation would be for tasks to be classified as _urgent_ if the remaining time is less than 3 days or the last 20% of time, whichever is greater. Alternatively, this may be scaled by workload and the size of the task, e.g. by mutliplying 3 days or 20% by (1 + Size) where quick tasks have a size factor of 1/7, long tasks have a size factor of 3/7 and marathon tasks have a size factor of 1. 

Urgent tasks should always be scheduled with full priority. 

### Mechanic: Effort

A tasks effort depends upon its size and is scaled by the fun factor. A basic formula may be as follows (subject to experimentation):

    ```Effort = Size * Weeks * (1 + (1/Fun))```

Where quick tasks have a size factor of 1/7, long tasks have a size factor of 3/7 and marathon tasks have a size factor of 1. 

The effort is calculated when the task is inputed, so the Weeks are in fact the weeks from input to deadline. This follows the fairly reasonable assumption that longer tasks will have a longer deadline. One modification may be to remove the length (weeks) parameter.

### Scheduling Non-Urgent Tasks

If there are free slots available on the list, then non-urgent tasks may be scheduled.

#### Based upon size
One approach may be to schedule tasks a certain number of times, e.g.
    - Small tasks are scheduled once a week
    - Long tasks are scheduled 3 times a week
    - Marathon tasks are scheduled 5 times a week (and may occupy 2 slots)
Since we want to schedule tasks fairly evenly, we can look through the non-urgent tasks and pick those which have been scheduled less times, by computing a fraction:

(Times Scheduled So Far) / (Total Expected)

So that even though small tasks are scheduled less times than marathon ones, they are represented equally.

Another approach may be to use the effort of the task. If we use length-dependent effort, then it represents how many times we expect the task to be scheduled, roughly.
