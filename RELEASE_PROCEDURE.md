#Release procedure

##Addon
1. Update version in `package.json`.
2. Set `TabTrekkerConfig.dev` to `false`.
3. Turn off `TabTrekkerLogger` logging.
4. Upload strings for translation and download latest translations.
5. Update changelog.
6. Update screenshots and addon description (if needed).
7. Build XPI and copy to `tabtrekker/releases`.
8. Submit XPI to Mozilla Addons.
9. Commit release changes and XPI. Tag release commit. Rebase master to develop.

##API
1. In `tabtrekker/api`, update Parse command line tool by running `parse update`.
2. Run `parse deploy TabTrekkerProd`.
