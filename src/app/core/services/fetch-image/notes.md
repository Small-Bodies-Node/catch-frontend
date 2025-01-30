# Fetch Image Service

Last Updated: Jan 30th 2025

We have the challenge of not overloading the image-cutout server. In trying to find the best trade off between:

i) getting all the requested images downloaded and displayed in the browser fast,
ii) minimizing server overload,
iii) keeping the code simple to maintain

... DWD tried several different parameterized approaches. For example, DWD tried delaying the start of the next task to some minimum time after the end of the last task, or some time after the last error.

After playing around a lot DWD concluded that the best trade off of the 3 desiderata above is:

1. Use N=4 concurrent tasks for the server as of Jan 30th 2025.
2. Re-try mechanism is essential; N=4 seems to be a stable value that almost never causes server overloads; however N=5+ causes steep increase in need to retries.
3. Staggered start: introduce a minimum delay between the first batch of N tasks to that you do not spike the server all at once. After the first N tasks, don't bother with a variable delay because we can assume on average uniform spread of server resources
