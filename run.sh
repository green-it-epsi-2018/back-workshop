#!/bin/bash
cd $(dirname $0)
logfile="logs/script-$(date +'%d-%m-%Y').log"
newpathfile="./calendar/calendar.ics"
mkdir -p $(dirname logfile)
node index.js >> $logfile && cp events.ics $newpathfile && chown www-data: $newpathfile 
