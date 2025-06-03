#!/bin/bash

# Reset iOS simulators to ensure a clean testing environment
echo "Shutting down all iOS simulators..."
xcrun simctl shutdown all

echo "Erasing all iOS simulators..."
xcrun simctl erase all

echo "iOS simulators have been reset." 