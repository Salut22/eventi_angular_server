#!/bin/bash
# Questo script legge una provincia dall'array di tutte le province di italia
Setlocal EnableDelayedExpansion
set province=ancona ascoli-piceno fermo macerata pesaro-e-urbino
#(for %%a in (%province%) do (
#   echo %%a
#))
casperjs virgilio.js %province%
