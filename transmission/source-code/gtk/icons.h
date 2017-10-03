/*
 * icons.[ch] written by Paolo Bacchilega, who writes:
 * "There is no problem for me, you can license
 * my code under whatever licence you wish :)"
 *
 * $Id: icons.h 14724 2016-03-29 16:37:21Z jordan $
 */

#pragma once

#define DIRECTORY_MIME_TYPE "folder"
#define UNKNOWN_MIME_TYPE "unknown"

const char * gtr_get_mime_type_from_filename (const char *file);

GdkPixbuf  * gtr_get_mime_type_icon (const char   * mime_type,
                                     GtkIconSize    icon_size,
                                     GtkWidget    * for_widget);

