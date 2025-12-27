# Changelog

All notable changes to the **FortiRent** project will be documented in this file.

## [Unreleased]

### Added
- Created `CHANGELOG.md` to track project history.
- Implemented **12-round bcrypt hashing** for password storage.
- Added password complexity enforcement (Uppsercase, lower, number, symbol, min 10 chars).
- Added password history tracking (last 3 passwords cannot be reused).
- Added password expiry policy (90 days).
