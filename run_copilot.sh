#!/bin/bash
export GITHUB_TOKEN=$(gh auth token)
export GH_TOKEN=$GITHUB_TOKEN
export COPILOT_GITHUB_TOKEN=$GITHUB_TOKEN
copilot -p "$1" --yolo
