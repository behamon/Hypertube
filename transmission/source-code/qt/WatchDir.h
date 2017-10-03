/*
 * This file Copyright (C) 2009-2015 Mnemosyne LLC
 *
 * It may be used under the GNU GPL versions 2 or 3
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: WatchDir.h 14724 2016-03-29 16:37:21Z jordan $
 */

#pragma once

#include <QObject>
#include <QSet>
#include <QString>

class QFileSystemWatcher;

class TorrentModel;

class WatchDir: public QObject
{
    Q_OBJECT

  public:
    WatchDir (const TorrentModel&);
    virtual ~WatchDir ();

    void setPath (const QString& path, bool isEnabled);

  signals:
    void torrentFileAdded (const QString& filename);

  private:
    enum
    {
      OK,
      DUPLICATE,
      ERROR
    };

  private:
    int metainfoTest (const QString& filename) const;

  private slots:
    void watcherActivated (const QString& path);
    void onTimeout ();

    void rescanAllWatchedDirectories ();

  private:
    const TorrentModel& myModel;

    QSet<QString> myWatchDirFiles;
    QFileSystemWatcher * myWatcher;
};

