#Release procedure

##Addon
1. Update version in `package.json`.
2. Set `TabTrekkerConfig.dev` to `false`.
3. Turn off `TabTrekkerLogger` logging.
4. Update screenshots and addon description (if needed).
5. Commit release changes and XPI. Tag release commit. Rebase master to develop.

##API
1. In `tabtrekker/api`, run `parse deploy TabTrekkerProd`.