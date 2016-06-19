#!/bin/bash
# Questo script legge una provincia dall'array di tutte le province di italia
Setlocal EnableDelayedExpansion
set province=teramo pescara chieti l-aquila
#(for %%a in (%province%) do (
#   echo %%a
#))
casperjs virgilio.js %province%
