Endpoints: 

-->     /meetings : 
                  > Accepts a POST request to insert a meeting detail in the database.(Here a mongoDb cluster)
                  > The meeting generation will fail if a same user with RSVP='yes'(Case Sensitive) tries to insert details with clashing time slots.
                  # Assumptions made:
                                   The StartTime and EndTime properties of the meeting object will have date time in ISOstring format.
-->     /meeting/:id :
                  > Accepts a GET request and the meeting id needs to be passed in the url params.
-->     /meetings? :
                  > The endpoint accepts a GET request and the url query may contain either a participant Email or a time slot with start? and end? query alongwith limit? and page? queries for pagination.
                  > Supports Pagination.
                  # Assumptions made:
                                    The database query permofed is 5.30hrs lagging for local time as the database has ISOstrings in GMT. Therefore the values passed should be passed accordingly i.e. <required_query_time>-5.30hrs.
   